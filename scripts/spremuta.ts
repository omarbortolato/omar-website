/**
 * scripts/spremuta.ts
 * Dato un page_id Notion: genera la Spremuta da zero e fa il deploy.
 *
 * Usage:
 *   npm run spremuta -- --page-id=75cef582-d259-8235-87ab-8142a076a1fc
 *
 * Env richiesti in .env.local:
 *   NOTION_API_KEY
 *   ANTHROPIC_API_KEY
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { execSync } from "child_process";
import { loadEnv, makeSlug, fillTemplate, generatePdf, SpremutaContent, BookData } from "../lib/pdf-generator";

const ROOT = process.cwd();
loadEnv(ROOT);

// ─── 1. Argomento ─────────────────────────────────────────────────────────────

const pageId = process.argv.find((a) => a.startsWith("--page-id="))?.split("=")[1];
if (!pageId) {
  console.error("❌  Manca --page-id");
  console.error("   Uso: npm run spremuta -- --page-id=<notion-page-id>");
  process.exit(1);
}

const NOTION_KEY = process.env.NOTION_API_KEY;
if (!NOTION_KEY) {
  console.error("❌  NOTION_API_KEY non trovata in .env.local");
  process.exit(1);
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) {
  console.error("❌  ANTHROPIC_API_KEY non trovata in .env.local");
  console.error("   Aggiungila con: echo \"ANTHROPIC_API_KEY=sk-ant-...\" >> .env.local");
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function richText(arr: { plain_text: string }[] | undefined): string {
  return Array.isArray(arr) ? arr.map((r) => r.plain_text).join("") : "";
}

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${question} [y/N] `, (ans) => { rl.close(); resolve(ans.trim().toLowerCase() === "y"); });
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {

  // ── 2. Leggi da Notion ────────────────────────────────────────────────────
  console.log(`\n📖  Leggo libro da Notion...`);
  const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: { Authorization: `Bearer ${NOTION_KEY}`, "Notion-Version": "2022-06-28" },
  });
  if (!pageRes.ok) {
    console.error(`❌  Notion error ${pageRes.status}: ${await pageRes.text()}`);
    process.exit(1);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = ((await pageRes.json()) as any).properties;

  const title    = richText(props?.Titolo?.title);
  const author   = richText(props?.Autore?.rich_text);
  const category: string = props?.Categoria?.select?.name ?? "";
  const amazonLink: string | null = props?.["Amazon Link"]?.url ?? null;
  const existingPdf: string | null = props?.["Link PDF"]?.url ?? null;

  if (!title) { console.error("❌  Titolo non trovato nella pagina."); process.exit(1); }

  console.log(`   📚 ${title} — ${author}`);
  if (amazonLink) console.log(`   🛒 Amazon: ${amazonLink}`);

  if (existingPdf) {
    console.log(`\n⚠️   Link PDF già presente: ${existingPdf}`);
    const ok = await confirm("Vuoi rigenerare e sovrascrivere?");
    if (!ok) { console.log("Annullato."); process.exit(0); }
  }

  // ── 3. Chiama Anthropic ───────────────────────────────────────────────────
  console.log("\n🤖  Genero contenuto con Claude...");

  const userPrompt = `Crea una Spremuta per il libro "${title}" di ${author} (categoria: ${category}).
Restituisci SOLO questo JSON valido, nessun testo fuori:
{
  "intro": "2 righe — perché questa non è una sintesi",
  "libro_90s": "max 100 parole — di cosa parla e chi dovrebbe leggerlo",
  "idee": [
    {"emoji": "...", "titolo": "...", "testo": "max 80 caratteri"},
    {"emoji": "...", "titolo": "...", "testo": "max 80 caratteri"},
    {"emoji": "...", "titolo": "...", "testo": "max 80 caratteri"},
    {"emoji": "...", "titolo": "...", "testo": "max 80 caratteri"},
    {"emoji": "...", "titolo": "...", "testo": "max 80 caratteri"}
  ],
  "azioni": [
    {"numero": 1, "titolo": "...", "testo": "max 80 caratteri", "ai_tip": "max 60 caratteri"},
    {"numero": 2, "titolo": "...", "testo": "max 80 caratteri", "ai_tip": "max 60 caratteri"},
    {"numero": 3, "titolo": "...", "testo": "max 80 caratteri", "ai_tip": "max 60 caratteri"},
    {"numero": 4, "titolo": "...", "testo": "max 80 caratteri", "ai_tip": "max 60 caratteri"},
    {"numero": 5, "titolo": "...", "testo": "max 80 caratteri", "ai_tip": "max 60 caratteri"}
  ],
  "ai_regge": "max 80 caratteri",
  "ai_cambia": "max 80 caratteri",
  "ai_insight": "max 120 caratteri",
  "citazione": "max 15 parole dalla letteratura generale sul tema",
  "citazione_fonte": "Autore, Opera",
  "libri_correlati": [
    {"titolo": "...", "autore": "...", "perche": "max 60 caratteri"},
    {"titolo": "...", "autore": "...", "perche": "max 60 caratteri"},
    {"titolo": "...", "autore": "...", "perche": "max 60 caratteri"}
  ]
}`;

  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: "Sei Omar Bortolato, imprenditore italiano e AI practitioner. Scrivi in prima persona, tono diretto, ottimista e friendly. Restituisci SOLO JSON valido, nessun testo fuori.",
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!aiRes.ok) {
    console.error(`❌  Anthropic error ${aiRes.status}: ${await aiRes.text()}`);
    process.exit(1);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawText: string = ((await aiRes.json()) as any).content[0].text;

  // ── 4. Parsa JSON ─────────────────────────────────────────────────────────
  const cleaned = rawText.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "").trim();
  let content: SpremutaContent;
  try {
    content = JSON.parse(cleaned) as SpremutaContent;
  } catch (e) {
    console.error(`❌  JSON non valido dalla risposta Claude: ${e}`);
    console.error(`   Raw (300 char): ${cleaned.substring(0, 300)}`);
    process.exit(1);
  }
  console.log("✅  Contenuto generato");

  // ── 5. Genera PDF ─────────────────────────────────────────────────────────
  const slug = makeSlug(title);
  const pdfPath = path.join(ROOT, "public", "spremute", `${slug}.pdf`);
  const templatePath = path.join(ROOT, "templates", "spremute", "TEMPLATE.html");

  console.log(`\n🛠️   Genero PDF...`);
  const book: BookData = { title, author, category, amazonLink };
  const html = fillTemplate(fs.readFileSync(templatePath, "utf-8"), book, content);
  await generatePdf(html, pdfPath);

  const sizeKb = Math.round(fs.statSync(pdfPath).size / 1024);
  console.log(`✅  PDF: public/spremute/${slug}.pdf (${sizeKb} KB)`);

  // ── 6. Git push ───────────────────────────────────────────────────────────
  console.log("\n🚀  Deploy...");
  execSync(`git add public/spremute/${slug}.pdf`, { stdio: "inherit", cwd: ROOT });
  execSync(`git commit -m "Add Spremuta: ${title}"`, { stdio: "inherit", cwd: ROOT });
  execSync("git push", { stdio: "inherit", cwd: ROOT });
  console.log("✅  Pushato");

  // ── 7. Aggiorna Notion ────────────────────────────────────────────────────
  const pdfUrl = `https://www.omarbortolato.it/spremute/${slug}.pdf`;
  const notionUpdate = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({ properties: { "Link PDF": { url: pdfUrl } } }),
  });
  if (!notionUpdate.ok) {
    console.warn(`⚠️   Notion update failed (${notionUpdate.status}) — aggiorna Link PDF manualmente: ${pdfUrl}`);
  } else {
    console.log(`✅  Notion aggiornato: ${pdfUrl}`);
  }

  console.log(`\n🍊  Spremuta live tra 1-2 minuti: https://www.omarbortolato.it/libri/${slug}\n`);
}

main().catch((err) => {
  console.error(`\n❌  ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
