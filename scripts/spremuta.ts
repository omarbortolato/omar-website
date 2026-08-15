/**
 * SPREMUTA — script one-shot
 *
 * Per usarlo: cambia il PAGE_ID qui sotto con quello del libro Notion,
 * poi esegui:  npm run spremuta
 *
 * Il PAGE_ID si trova nell'URL della pagina Notion:
 * https://www.notion.so/workspace/Titolo-[PAGE_ID]
 *
 * Env richiesti in .env.local:
 *   NOTION_API_KEY
 *   ANTHROPIC_API_KEY
 */

const PAGE_ID = "CAMBIA_QUESTO_CON_IL_PAGE_ID_NOTION";

// ── tutto il resto è automatico ──────────────────────────────────────────────

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { execSync } from "child_process";
import {
  loadEnv,
  makeSlug,
  fillTemplate,
  generatePdf,
  fetchPagePlainText,
  SpremutaContent,
  BookData,
} from "../lib/pdf-generator";

const ROOT = process.cwd();
loadEnv(ROOT);

// Supporta anche --page-id=... come argomento CLI (override del PAGE_ID)
const pageId = process.argv.find((a) => a.startsWith("--page-id="))?.split("=")[1] ?? PAGE_ID;

if (!pageId || pageId === "CAMBIA_QUESTO_CON_IL_PAGE_ID_NOTION") {
  console.error("❌  Cambia PAGE_ID in cima allo script con l'ID della pagina Notion.");
  process.exit(1);
}

const NOTION_KEY = process.env.NOTION_API_KEY;
if (!NOTION_KEY) {
  console.error("❌  NOTION_API_KEY mancante in .env.local");
  process.exit(1);
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) {
  console.error("❌  ANTHROPIC_API_KEY mancante in .env.local");
  console.error('   Aggiungila: echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env.local');
  process.exit(1);
}

const TEMPLATE_PATH = path.join(ROOT, "templates", "spremute", "TEMPLATE.html");
if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`❌  Template non trovato: ${TEMPLATE_PATH}`);
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function richText(arr: { plain_text: string }[] | undefined): string {
  return Array.isArray(arr) ? arr.map((r) => r.plain_text).join("") : "";
}

async function confirm(q: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${q} [y/N] `, (ans) => { rl.close(); resolve(ans.trim().toLowerCase() === "y"); });
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const border = "══════════════════════════════════════";
  console.log(`\n${border}`);
  console.log("🍊  SPRE MUTA — generazione in corso");
  console.log(`${border}\n`);

  // ── 1. Leggi da Notion ────────────────────────────────────────────────────
  console.log("📖  Leggo libro da Notion...");
  const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: { Authorization: `Bearer ${NOTION_KEY}`, "Notion-Version": "2022-06-28" },
  });
  if (!pageRes.ok) {
    console.error(`❌  Notion error ${pageRes.status}: ${await pageRes.text()}`);
    process.exit(1);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = ((await pageRes.json()) as any).properties;

  const title: string = richText(props?.Titolo?.title);
  const author: string = richText(props?.Autore?.rich_text);
  const category: string = props?.Categoria?.select?.name ?? "";
  const amazonLink: string | null = props?.["Amazon Link"]?.url ?? null;
  const existingPdf: string | null = props?.["Link PDF"]?.url ?? null;

  if (!title) { console.error("❌  Titolo non trovato."); process.exit(1); }

  console.log(`   📚 "${title}" di ${author}`);
  if (category) console.log(`   📂 Categoria: ${category}`);
  if (amazonLink) console.log(`   🛒 Amazon: ${amazonLink}`);

  // ── 2. Controllo sovrascrittura ───────────────────────────────────────────
  if (existingPdf) {
    console.log(`\n⚠️   Link PDF già presente: ${existingPdf}`);
    const ok = await confirm("Vuoi rigenerare e sovrascrivere?");
    if (!ok) { console.log("Annullato."); process.exit(0); }
  }

  // ── 3. Leggi gli appunti dal corpo della pagina Notion ────────────────────
  console.log("\n📝  Leggo gli appunti dal corpo pagina...");
  let appunti = "";
  try {
    appunti = await fetchPagePlainText(NOTION_KEY as string, pageId);
  } catch (e) {
    console.warn(`⚠️   Lettura appunti fallita: ${e instanceof Error ? e.message : e}`);
  }
  if (appunti) {
    console.log(`✅  Appunti: ${appunti.length} caratteri passati al modello`);
  } else {
    console.warn("⚠️   Nessun appunto trovato, Spremuta generata senza grounding");
  }

  // Sezione di grounding: presente solo se ci sono appunti, così un libro senza
  // appunti mantiene esattamente il comportamento precedente.
  const groundingBlock = appunti
    ? `\n<appunti_lettura>\n${appunti}\n</appunti_lettura>\n\n` +
      `Regole vincolanti sul materiale:\n` +
      `- Gli appunti in <appunti_lettura> sono la fonte primaria e vincolante.\n` +
      `- Ogni idea, azione, citazione e riferimento deve derivare da quel materiale.\n` +
      `- Non aggiungere aneddoti, nomi, cifre, date o studi che non compaiono negli appunti.\n` +
      `- Se un campo dello schema non è ricavabile dagli appunti, riempilo restando su ciò che gli appunti supportano, senza inventare fatti verificabili.\n` +
      `- Non menzionare mai nell'output gli appunti, la loro esistenza, la loro provenienza o il processo di generazione. Il PDF deve leggersi come rielaborazione diretta dell'autore del sito.\n\n`
    : "";

  // ── 4. Genera contenuto con Anthropic ────────────────────────────────────
  console.log("\n🤖  Genero contenuto con Claude...");

  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY as string,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system:
        "Sei Omar Bortolato, imprenditore italiano e AI practitioner. " +
        "Scrivi in prima persona, tono diretto, ottimista e friendly. " +
        "Restituisci SOLO JSON valido, nessun testo fuori.",
      messages: [{
        role: "user",
        content:
          `Crea una Spremuta per il libro "${title}" di ${author} (categoria: ${category}).\n` +
          groundingBlock +
          `Restituisci SOLO questo JSON valido, nessun testo fuori:\n` +
          `{\n` +
          `  "intro": "2-3 righe — perché questa non è una sintesi ma una rielaborazione personale",\n` +
          `  "libro_90s": "150-180 parole — riassunto approfondito: di cosa parla, struttura/temi principali, esempi concreti del libro, la tesi di fondo, e chi dovrebbe leggerlo",\n` +
          `  "idee": [\n` +
          `    {"emoji": "...", "titolo": "titolo breve", "testo": "200-280 caratteri, 2-3 frasi con argomentazione"},\n` +
          `    {"emoji": "...", "titolo": "titolo breve", "testo": "200-280 caratteri, 2-3 frasi con argomentazione"},\n` +
          `    {"emoji": "...", "titolo": "titolo breve", "testo": "200-280 caratteri, 2-3 frasi con argomentazione"},\n` +
          `    {"emoji": "...", "titolo": "titolo breve", "testo": "200-280 caratteri, 2-3 frasi con argomentazione"},\n` +
          `    {"emoji": "...", "titolo": "titolo breve", "testo": "200-280 caratteri, 2-3 frasi con argomentazione"}\n` +
          `  ],\n` +
          `  "azioni": [\n` +
          `    {"numero": 1, "titolo": "titolo azione", "testo": "180-220 caratteri, azione concreta e dettagliata", "ai_tip": "100-120 caratteri, suggerimento AI specifico"},\n` +
          `    {"numero": 2, "titolo": "titolo azione", "testo": "180-220 caratteri, azione concreta e dettagliata", "ai_tip": "100-120 caratteri, suggerimento AI specifico"},\n` +
          `    {"numero": 3, "titolo": "titolo azione", "testo": "180-220 caratteri, azione concreta e dettagliata", "ai_tip": "100-120 caratteri, suggerimento AI specifico"},\n` +
          `    {"numero": 4, "titolo": "titolo azione", "testo": "180-220 caratteri, azione concreta e dettagliata", "ai_tip": "100-120 caratteri, suggerimento AI specifico"},\n` +
          `    {"numero": 5, "titolo": "titolo azione", "testo": "180-220 caratteri, azione concreta e dettagliata", "ai_tip": "100-120 caratteri, suggerimento AI specifico"}\n` +
          `  ],\n` +
          `  "ai_regge": "180-220 caratteri — cosa della tesi del libro regge ancora ed è anzi rafforzato nell'era AI",\n` +
          `  "ai_cambia": "180-220 caratteri — cosa cambia radicalmente nell'era AI rispetto a quando è stato scritto il libro",\n` +
          `  "ai_insight": "250-300 caratteri — l'insight più stuzzicante che collega il tema del libro all'AI",\n` +
          `  "citazione": "max 15 parole, una citazione autentica e verificabile (dal libro o dall'autore)",\n` +
          `  "citazione_fonte": "Autore, Opera",\n` +
          `  "libri_correlati": [\n` +
          `    {"titolo": "...", "autore": "...", "perche": "80-100 caratteri"},\n` +
          `    {"titolo": "...", "autore": "...", "perche": "80-100 caratteri"},\n` +
          `    {"titolo": "...", "autore": "...", "perche": "80-100 caratteri"}\n` +
          `  ]\n` +
          `}`,
      }],
    }),
  });
  if (!aiRes.ok) {
    console.error(`❌  Anthropic error ${aiRes.status}: ${await aiRes.text()}`);
    process.exit(1);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawText: string = ((await aiRes.json()) as any).content[0].text;

  // ── 5. Parsa JSON ─────────────────────────────────────────────────────────
  const cleaned = rawText.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "").trim();
  let content: SpremutaContent;
  try {
    content = JSON.parse(cleaned) as SpremutaContent;
  } catch (e) {
    console.error(`❌  JSON non valido: ${e}`);
    console.error(`   Raw: ${cleaned.substring(0, 300)}`);
    process.exit(1);
  }
  console.log("✅  Contenuto generato");

  // ── 6. Genera PDF ─────────────────────────────────────────────────────────
  const slug = makeSlug(title);
  const pdfPath = path.join(ROOT, "public", "spremute", `${slug}.pdf`);

  console.log(`\n🛠️   Genero PDF: ${slug}.pdf`);
  const book: BookData = { title, author, category, amazonLink };
  const html = fillTemplate(fs.readFileSync(TEMPLATE_PATH, "utf-8"), book, content);
  await generatePdf(html, pdfPath);

  const sizeKb = Math.round(fs.statSync(pdfPath).size / 1024);
  console.log(`✅  PDF: public/spremute/${slug}.pdf (${sizeKb} KB)`);

  // ── 7. Aggiorna Notion PRIMA del push ─────────────────────────────────────
  // (così Vercel vede pdfUrl già impostato durante il build)
  const pdfUrl = `https://www.omarbortolato.it/spremute/${slug}.pdf`;
  console.log("\n📝  Aggiorno Notion...");
  const notionRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({ properties: { "Link PDF": { url: pdfUrl } } }),
  });
  if (!notionRes.ok) {
    console.warn(`⚠️   Notion update failed (${notionRes.status}) — continuo comunque`);
  } else {
    console.log(`✅  Notion aggiornato: ${pdfUrl}`);
  }

  // ── 8. Git push ───────────────────────────────────────────────────────────
  console.log("\n🚀  Deploy...");
  execSync(`git add public/spremute/${slug}.pdf`, { stdio: "inherit", cwd: ROOT });
  execSync(`git commit -m "Add Spremuta: ${title}"`, { stdio: "inherit", cwd: ROOT });
  execSync("git push", { stdio: "inherit", cwd: ROOT });
  console.log("✅  Pushato su GitHub");

  // ── 9. Output finale ──────────────────────────────────────────────────────
  console.log(`\n${border}`);
  console.log("🍊  SPREMUTA COMPLETATA");
  console.log(border);
  console.log(`PDF: ${pdfUrl}`);
  console.log(`Web: https://www.omarbortolato.it/libri/${slug}`);
  console.log("Live tra 1-2 minuti dopo il deploy Vercel.");
  console.log(`${border}\n`);
}

main().catch((err) => {
  console.error(`\n❌  ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
