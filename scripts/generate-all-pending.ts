/**
 * generate-all-pending.ts
 * Genera i PDF per tutti i libri Notion dove:
 *   - "Genera Spremuta" = checked
 *   - "Link PDF" = vuoto (non ancora generato)
 *
 * Per ogni libro legge "Dati Spremuta" (JSON scritto da n8n),
 * riempie TEMPLATE.html e genera il PDF con Puppeteer.
 * Dopo la generazione aggiorna "Link PDF" su Notion.
 *
 * Usage:
 *   npm run generate-pending
 *   npx tsx scripts/generate-all-pending.ts
 *
 * Prerequisiti Notion DB (campo → tipo):
 *   "Genera Spremuta"  → checkbox
 *   "Dati Spremuta"    → rich_text (JSON scritto da n8n)
 *   "Link PDF"         → url
 *   "Amazon Link"      → url
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

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "templates", "spremute", "TEMPLATE.html");
const OUTPUT_DIR = path.join(ROOT, "public", "spremute");
const BASE_URL = "https://www.omarbortolato.it";
const BOOKS_DB_ID = "0daef582d259833da7bb014a34479f60";
const NOTION_VERSION = "2022-06-28";

loadEnv(ROOT);
const NOTION_KEY = process.env.NOTION_API_KEY ?? "";

// ─── Notion helpers ───────────────────────────────────────────────────────────

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

// ─── Pending books query ──────────────────────────────────────────────────────

interface PendingBook {
  id: string;
  title: string;
  author: string;
  category: string;
  amazonLink: string | null;
  datiSpremuta: string;
}

async function queryPendingBooks(): Promise<PendingBook[]> {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${BOOKS_DB_ID}/query`,
    {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        filter: {
          and: [
            { property: "Genera Spremuta", checkbox: { equals: true } },
            { property: "Link PDF", url: { is_empty: true } },
          ],
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion query failed (${res.status}): ${err}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: { results: any[] } = await res.json();
  const books: PendingBook[] = [];

  for (const page of data.results) {
    const props = page.properties;
    const title = extractRichText(props?.Titolo?.title ?? []);
    if (!title) continue;

    const datiRaw = extractRichText(props?.["Dati Spremuta"]?.rich_text ?? []);
    if (!datiRaw.trim()) {
      console.warn(`  ⚠️  "${title}" — Dati Spremuta vuoti, skip`);
      continue;
    }

    books.push({
      id: page.id,
      title,
      author: extractRichText(props?.Autore?.rich_text ?? []),
      category: props?.Categoria?.select?.name ?? "",
      amazonLink: props?.["Amazon Link"]?.url ?? null,
      datiSpremuta: datiRaw,
    });
  }

  return books;
}

async function updateNotionPdfUrl(pageId: string, pdfUrl: string): Promise<void> {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({ properties: { "Link PDF": { url: pdfUrl } } }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion update failed (${res.status}): ${err}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!NOTION_KEY) {
    console.error("❌  NOTION_API_KEY non trovata in .env.local");
    process.exit(1);
  }
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`❌  Template base non trovato: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  console.log("🔍  Cerco libri pending in Notion...");
  const books = await queryPendingBooks();

  if (books.length === 0) {
    console.log("✅  Nessun libro pending. Tutto aggiornato.");
    return;
  }

  console.log(`📚  Trovati ${books.length} libro/i da processare.\n`);
  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  for (const book of books) {
    console.log(`📖  Generating: ${book.title} di ${book.author}...`);

    let content: SpremutaContent;
    try {
      content = JSON.parse(book.datiSpremuta) as SpremutaContent;
    } catch (e) {
      console.error(`  ❌ JSON non valido per "${book.title}": ${e}`);
      continue;
    }

    const bookData: BookData = {
      title: book.title,
      author: book.author,
      category: book.category,
      amazonLink: book.amazonLink,
    };

    const html = fillTemplate(template, bookData, content);
    const slug = makeSlug(book.title);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.pdf`);

    await generatePdf(html, outputPath);
    const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(`  ✅  PDF: ${slug}.pdf (${sizeKb} KB)`);

    const pdfUrl = `${BASE_URL}/spremute/${slug}.pdf`;
    await updateNotionPdfUrl(book.id, pdfUrl);
    console.log(`  📝  Notion: Link PDF = ${pdfUrl}\n`);
  }

  console.log("🎉  All done. Esegui: git add public/spremute && git push");
}

main().catch((err) => {
  console.error("❌  Errore:", err);
  process.exit(1);
});
