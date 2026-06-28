/**
 * finalize-spremuta.ts
 * Genera il PDF di una Spremuta partendo da un JSON di contenuto già pronto
 * (bypassa il campo Notion "Dati Spremuta", che non esiste nello schema attuale —
 * usato quando il contenuto viene scritto direttamente, es. da Claude Code).
 *
 * Usage:
 *   npx tsx scripts/finalize-spremuta.ts <page_id> <content_json_path>
 *
 * Legge titolo/autore/categoria/amazonLink dalla pagina Notion via API,
 * genera il PDF in public/spremute/{slug}.pdf e aggiorna "Link PDF" su Notion.
 */

import fs from "fs";
import path from "path";
import {
  loadEnv,
  makeSlug,
  fillTemplate,
  generatePdf,
  SpremutaContent,
  BookData,
} from "../lib/pdf-generator";

const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "templates", "spremute", "TEMPLATE.html");
const OUTPUT_DIR = path.join(ROOT, "public", "spremute");
const BASE_URL = "https://www.omarbortolato.it";
const NOTION_VERSION = "2022-06-28";

loadEnv(ROOT);
const NOTION_KEY = process.env.NOTION_API_KEY ?? "";

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

function extractRichText(arr: { plain_text: string }[] | undefined): string {
  if (!Array.isArray(arr)) return "";
  return arr.map((r) => r.plain_text).join("");
}

async function fetchBook(pageId: string): Promise<BookData & { title: string }> {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: notionHeaders(),
  });
  if (!res.ok) throw new Error(`Notion fetch failed (${res.status}): ${await res.text()}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page: any = await res.json();
  const props = page.properties;
  const title = extractRichText(props?.Titolo?.title ?? []);
  if (!title) throw new Error(`Pagina ${pageId} senza titolo`);
  return {
    title,
    author: extractRichText(props?.Autore?.rich_text ?? []),
    category: props?.Categoria?.select?.name ?? "",
    amazonLink: props?.["Amazon Link"]?.url ?? null,
  };
}

async function updateNotionPdfUrl(pageId: string, pdfUrl: string): Promise<void> {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({ properties: { "Link PDF": { url: pdfUrl } } }),
  });
  if (!res.ok) throw new Error(`Notion update failed (${res.status}): ${await res.text()}`);
}

async function main() {
  const [pageId, contentPath] = process.argv.slice(2);
  if (!pageId || !contentPath) {
    console.error("Uso: npx tsx scripts/finalize-spremuta.ts <page_id> <content_json_path>");
    process.exit(1);
  }
  if (!NOTION_KEY) {
    console.error("❌  NOTION_API_KEY non trovata in .env.local");
    process.exit(1);
  }

  const content = JSON.parse(fs.readFileSync(contentPath, "utf-8")) as SpremutaContent;
  const book = await fetchBook(pageId);
  console.log(`📖  ${book.title} di ${book.author}`);

  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  const html = fillTemplate(template, book, content);
  const slug = makeSlug(book.title);
  const outputPath = path.join(OUTPUT_DIR, `${slug}.pdf`);

  await generatePdf(html, outputPath);
  const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`  ✅  PDF: ${slug}.pdf (${sizeKb} KB)`);

  const pdfUrl = `${BASE_URL}/spremute/${slug}.pdf`;
  await updateNotionPdfUrl(pageId, pdfUrl);
  console.log(`  📝  Notion: Link PDF = ${pdfUrl}`);
}

main().catch((err) => {
  console.error("❌  Errore:", err);
  process.exit(1);
});
