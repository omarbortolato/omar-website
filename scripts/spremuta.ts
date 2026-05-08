/**
 * scripts/spremuta.ts
 * Comando unico: dalla pagina Notion al deploy in un colpo solo.
 *
 * Dato il page_id di un libro Notion:
 *  1. Legge proprietà del libro (titolo, autore, categoria, Amazon link)
 *  2. Recupera il contenuto strutturato (JSON) dalla pagina:
 *     - Prima cerca in "Dati Spremuta" (rich_text property, scritto da n8n)
 *     - Poi cerca un code block nel body (scritto da Claude MCP)
 *  3. Genera il PDF da TEMPLATE.html
 *  4. Aggiorna "Link PDF" su Notion
 *  5. git add, commit, push
 *
 * Usage:
 *   npm run spremuta -- --page-id=75cef582-d259-8235-87ab-8142a076a1fc
 *
 * Se "Link PDF" è già presente chiede conferma prima di sovrascrivere.
 */

import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
  CodeBlockObjectResponse,
  ParagraphBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { execSync } from "child_process";
import {
  loadEnv,
  makeSlug,
  fillTemplate,
  generatePdf,
  SpremutaContent,
  BookData,
} from "../lib/pdf-generator";

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "templates", "spremute", "TEMPLATE.html");
const SPRE_DIR = path.join(ROOT, "public", "spremute");
const BASE_URL = "https://www.omarbortolato.it";

loadEnv(ROOT);

// ─── Args ────────────────────────────────────────────────────────────────────

const pageId = process.argv.find((a) => a.startsWith("--page-id="))?.split("=")[1];
if (!pageId) {
  console.error("❌  Manca --page-id=<id>");
  console.error("   Esempio: npm run spremuta -- --page-id=75cef582-d259-8235-87ab-8142a076a1fc");
  process.exit(1);
}

const notionKey = process.env.NOTION_API_KEY;
if (!notionKey) {
  console.error("❌  NOTION_API_KEY non trovata in .env.local");
  process.exit(1);
}

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`❌  Template non trovato: ${TEMPLATE_PATH}`);
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractRichText(arr: { plain_text: string }[] | undefined): string {
  if (!Array.isArray(arr)) return "";
  return arr.map((r) => r.plain_text).join("");
}

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${question} [y/N] `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

// ─── Content extraction from page blocks ─────────────────────────────────────

async function extractContentFromBlocks(
  notion: Client,
  blockId: string
): Promise<SpremutaContent | null> {
  const response = await notion.blocks.children.list({ block_id: blockId });

  for (const block of response.results) {
    const b = block as BlockObjectResponse;

    // Code block → parse as JSON
    if (b.type === "code") {
      const cb = b as CodeBlockObjectResponse;
      const text = extractRichText(cb.code.rich_text as { plain_text: string }[]);
      const cleaned = text.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "").trim();
      try {
        return JSON.parse(cleaned) as SpremutaContent;
      } catch {
        // not valid JSON, continue
      }
    }

    // Paragraph that looks like JSON (fallback)
    if (b.type === "paragraph") {
      const pb = b as ParagraphBlockObjectResponse;
      const text = extractRichText(pb.paragraph.rich_text as { plain_text: string }[]).trim();
      if (text.startsWith("{")) {
        try {
          return JSON.parse(text) as SpremutaContent;
        } catch {
          // not valid JSON, continue
        }
      }
    }
  }

  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const notion = new Client({ auth: notionKey });

  // ── 1. Leggi proprietà libro ──────────────────────────────────────────────
  console.log(`\n📖  Leggo la pagina Notion ${pageId}...`);
  const page = await notion.pages.retrieve({ page_id: pageId as string });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = (page as PageObjectResponse).properties as any;

  const title = extractRichText(props?.Titolo?.title ?? []);
  if (!title) {
    console.error("❌  Campo Titolo vuoto o non trovato nella pagina.");
    process.exit(1);
  }

  const author = extractRichText(props?.Autore?.rich_text ?? []);
  const category: string = props?.Categoria?.select?.name ?? "";
  const amazonLink: string | null = props?.["Amazon Link"]?.url ?? null;
  const existingPdfUrl: string | null = props?.["Link PDF"]?.url ?? null;

  console.log(`   Titolo:    ${title}`);
  console.log(`   Autore:    ${author}`);
  console.log(`   Categoria: ${category}`);
  console.log(`   Amazon:    ${amazonLink ?? "(nessuno)"}`);

  // ── 2. Controllo sovrascrittura ───────────────────────────────────────────
  if (existingPdfUrl) {
    console.log(`\n⚠️   Link PDF già presente: ${existingPdfUrl}`);
    const ok = await confirm("Vuoi rigenerare e sovrascrivere il PDF esistente?");
    if (!ok) {
      console.log("❌  Annullato.");
      process.exit(0);
    }
  }

  // ── 3. Recupera contenuto strutturato ────────────────────────────────────
  console.log("\n🔍  Cerco contenuto Spremuta...");

  // Priorità 1: property "Dati Spremuta" (da n8n)
  const datiRaw = extractRichText(props?.["Dati Spremuta"]?.rich_text ?? []).trim();
  let content: SpremutaContent | null = null;

  if (datiRaw) {
    console.log('   Trovato in "Dati Spremuta" (property Notion)');
    try {
      content = JSON.parse(datiRaw) as SpremutaContent;
    } catch (e) {
      console.warn(`   ⚠️  JSON non valido in "Dati Spremuta": ${e}`);
    }
  }

  // Priorità 2: code block nel body della pagina (da Claude MCP)
  if (!content) {
    console.log("   Cerco JSON nel body della pagina (code block)...");
    content = await extractContentFromBlocks(notion, pageId as string);
    if (content) {
      console.log("   Trovato nel body della pagina ✓");
    }
  }

  if (!content) {
    console.error(`
❌  Contenuto Spremuta non trovato.

   La pagina deve contenere una delle seguenti:
   1. La property "Dati Spremuta" (rich_text) con il JSON generato da n8n
   2. Un blocco di codice (code block) nel body con il JSON del contenuto

   JSON atteso:
   {
     "intro": "...", "libro_90s": "...",
     "idee": [{emoji, titolo, testo}, ...×5],
     "azioni": [{numero, titolo, testo, ai_tip}, ...×5],
     "ai_regge": "...", "ai_cambia": "...", "ai_insight": "...",
     "citazione": "...", "citazione_fonte": "...",
     "libri_correlati": [{titolo, autore, perche}, ...×3]
   }
`);
    process.exit(1);
  }

  // ── 4. Genera PDF ─────────────────────────────────────────────────────────
  const slug = makeSlug(title);
  const outputPath = path.join(SPRE_DIR, `${slug}.pdf`);

  console.log(`\n🛠️   Genero PDF: ${slug}.pdf`);
  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  const bookData: BookData = { title, author, category, amazonLink };
  const html = fillTemplate(template, bookData, content);

  await generatePdf(html, outputPath);
  const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`✅  PDF generato: public/spremute/${slug}.pdf (${sizeKb} KB)`);

  // ── 5. Aggiorna Notion ────────────────────────────────────────────────────
  const pdfUrl = `${BASE_URL}/spremute/${slug}.pdf`;
  await notion.pages.update({
    page_id: pageId as string,
    properties: { "Link PDF": { url: pdfUrl } },
  });
  console.log(`✅  Notion aggiornato: Link PDF = ${pdfUrl}`);

  // ── 6. Git add, commit, push ──────────────────────────────────────────────
  console.log("\n🚀  Deploy...");
  execSync(`git add public/spremute/${slug}.pdf`, { stdio: "inherit", cwd: ROOT });
  execSync(`git commit -m "Add Spremuta: ${title}"`, { stdio: "inherit", cwd: ROOT });
  execSync("git push", { stdio: "inherit", cwd: ROOT });
  console.log(`\n✅  Pushato. Spremuta live tra 1-2 minuti.`);
  console.log(`   URL PDF: ${pdfUrl}`);
  console.log(`   Pagina:  ${BASE_URL}/libri/${slug}\n`);
}

main().catch((err) => {
  console.error("❌  Errore:", err);
  process.exit(1);
});
