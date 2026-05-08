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

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// ─── Paths ───────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "templates", "spremute", "TEMPLATE.html");
const OUTPUT_DIR = path.join(ROOT, "public", "spremute");
const BASE_URL = "https://www.omarbortolato.it";

// ─── Notion config ────────────────────────────────────────────────────────────

const BOOKS_DB_ID = "0daef582d259833da7bb014a34479f60";
const NOTION_VERSION = "2022-06-28";

// ─── Env loader (.env.local) ─────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

const NOTION_KEY = process.env.NOTION_API_KEY ?? "";

// ─── Slug ─────────────────────────────────────────────────────────────────────

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[àáâã]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõ]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface PendingBook {
  id: string;
  title: string;
  author: string;
  category: string;
  amazonLink: string | null;
  datiSpremuta: string; // JSON string from "Dati Spremuta" property
}

interface SpremutaContent {
  intro: string;
  libro_90s: string;
  idee: Array<{ emoji: string; titolo: string; testo: string }>;
  azioni: Array<{ numero: number; titolo: string; testo: string; ai_tip: string }>;
  ai_regge: string;
  ai_cambia: string;
  ai_insight: string;
  citazione: string;
  citazione_fonte: string;
  libri_correlati: Array<{ titolo: string; autore: string; perche: string }>;
}

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

// ─── Query pending books ──────────────────────────────────────────────────────

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
      console.warn(`  ⚠️  "${title}" — Dati Spremuta vuoti, skip (n8n deve generare prima il contenuto)`);
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

// ─── Template fill ────────────────────────────────────────────────────────────

function fillTemplate(template: string, book: PendingBook, content: SpremutaContent): string {
  let html = template;

  // Escape HTML special chars
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Cover
  html = html.replace(/\{\{BOOK_TITLE\}\}/g, esc(book.title));
  html = html.replace(/\{\{BOOK_AUTHOR\}\}/g, esc(book.author));
  html = html.replace(/\{\{BOOK_CATEGORY\}\}/g, esc(book.category));

  // Intro & Sec 1
  html = html.replace(/\{\{INTRO_TEXT\}\}/g, esc(content.intro));
  html = html.replace(/\{\{LIBRO_90S\}\}/g, esc(content.libro_90s));

  // Sec 2 — 5 ideas
  for (let i = 0; i < 5; i++) {
    const idea = content.idee[i] ?? { emoji: "💡", titolo: "", testo: "" };
    html = html.replace(`{{IDEA_${i + 1}_EMOJI}}`, idea.emoji);
    html = html.replace(`{{IDEA_${i + 1}_TITLE}}`, esc(idea.titolo));
    html = html.replace(`{{IDEA_${i + 1}_TEXT}}`, esc(idea.testo));
  }

  // Sec 3 — 5 actions
  for (let i = 0; i < 5; i++) {
    const az = content.azioni[i] ?? { numero: i + 1, titolo: "", testo: "", ai_tip: "" };
    html = html.replace(`{{AZIONE_${i + 1}_TITLE}}`, esc(az.titolo));
    html = html.replace(`{{AZIONE_${i + 1}_TEXT}}`, esc(az.testo));
    html = html.replace(`{{AZIONE_${i + 1}_AI}}`, esc(az.ai_tip));
  }

  // Sec 4 — AI angle
  html = html.replace(/\{\{AI_REGGE\}\}/g, esc(content.ai_regge));
  html = html.replace(/\{\{AI_CAMBIA\}\}/g, esc(content.ai_cambia));
  html = html.replace(/\{\{AI_INSIGHT\}\}/g, esc(content.ai_insight));

  // Quote
  html = html.replace(/\{\{CITAZIONE\}\}/g, esc(content.citazione));
  html = html.replace(/\{\{CITAZIONE_FONTE\}\}/g, esc(content.citazione_fonte));

  // Sec 5 — related books
  for (let i = 0; i < 3; i++) {
    const lb = content.libri_correlati[i] ?? { titolo: "", autore: "", perche: "" };
    html = html.replace(`{{LIBRO_C${i + 1}_TITLE}}`, esc(lb.titolo));
    html = html.replace(`{{LIBRO_C${i + 1}_AUTHOR}}`, esc(lb.autore));
    html = html.replace(`{{LIBRO_C${i + 1}_PERCHE}}`, esc(lb.perche));
  }

  // Amazon button
  if (book.amazonLink) {
    html = html.replace(/\{\{AMAZON_URL\}\}/g, book.amazonLink);
  } else {
    // Remove entire amazon-btn-wrap div
    html = html.replace(/<div class="amazon-btn-wrap">[\s\S]*?<\/div>/m, "");
  }

  return html;
}

// ─── PDF generation ───────────────────────────────────────────────────────────

async function generatePdf(html: string, outputPath: string): Promise<void> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }
}

// ─── Notion update ────────────────────────────────────────────────────────────

async function updateNotionPdfUrl(pageId: string, pdfUrl: string): Promise<void> {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({
      properties: {
        "Link PDF": { url: pdfUrl },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion update failed for ${pageId} (${res.status}): ${err}`);
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

    // Parse JSON content from Notion
    let content: SpremutaContent;
    try {
      content = JSON.parse(book.datiSpremuta) as SpremutaContent;
    } catch (e) {
      console.error(`  ❌ JSON non valido in "Dati Spremuta" per "${book.title}": ${e}`);
      console.error(`     Raw (primi 200 char): ${book.datiSpremuta.substring(0, 200)}`);
      continue;
    }

    // Validate required fields
    const missing: string[] = [];
    if (!content.intro) missing.push("intro");
    if (!content.libro_90s) missing.push("libro_90s");
    if (!content.idee?.length) missing.push("idee");
    if (!content.azioni?.length) missing.push("azioni");
    if (missing.length) {
      console.error(`  ❌ Campi mancanti in "Dati Spremuta": ${missing.join(", ")}`);
      continue;
    }

    // Fill template + generate PDF
    const html = fillTemplate(template, book, content);
    const slug = makeSlug(book.title);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.pdf`);

    await generatePdf(html, outputPath);
    const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(`  ✅  PDF generato: ${slug}.pdf (${sizeKb} KB)`);

    // Update Notion
    const pdfUrl = `${BASE_URL}/spremute/${slug}.pdf`;
    await updateNotionPdfUrl(book.id, pdfUrl);
    console.log(`  📝  Notion aggiornato: Link PDF = ${pdfUrl}`);
    console.log();
  }

  console.log("🎉  All done. Esegui: git add public/spremute && git push");
}

main().catch((err) => {
  console.error("❌  Errore:", err);
  process.exit(1);
});
