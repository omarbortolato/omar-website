/**
 * generate-pdf.ts
 * Genera un PDF da un template HTML nella cartella templates/spremute/.
 * Legge "Amazon Link" da Notion e lo inietta nel template prima della generazione.
 *
 * Usage:
 *   npx tsx scripts/generate-pdf.ts mastery-robert-greene
 *   npx tsx scripts/generate-pdf.ts mastery-robert-greene c12ef582-d259-8235-95e4-0178d486822d
 *
 * Input:  templates/spremute/[slug].html
 * Output: public/spremute/[slug].pdf
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// ─── Args ────────────────────────────────────────────────────────────────────

const slug = process.argv[2];
const pageIdArg = process.argv[3]; // opzionale

if (!slug) {
  console.error("❌  Fornisci lo slug del libro come argomento.");
  console.error("   Esempio: npx tsx scripts/generate-pdf.ts mastery-robert-greene");
  process.exit(1);
}

// ─── Paths ───────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const templatePath = path.join(ROOT, "templates", "spremute", `${slug}.html`);
const outputDir = path.join(ROOT, "public", "spremute");
const outputPath = path.join(outputDir, `${slug}.pdf`);

if (!fs.existsSync(templatePath)) {
  console.error(`❌  Template non trovato: ${templatePath}`);
  process.exit(1);
}

// ─── Env loader (.env.local) ─────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

// ─── Notion helpers ───────────────────────────────────────────────────────────

const NOTION_VERSION = "2022-06-28";
const BOOKS_DB_ID = "0daef582d259833da7bb014a34479f60";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function getAmazonLink(notionKey: string): Promise<string | null> {
  // Se page_id passato come argomento, usa quello direttamente
  if (pageIdArg) {
    return fetchAmazonFromPage(notionKey, pageIdArg);
  }

  // Altrimenti cerca nel DB per slug
  console.log(`🔍  Ricerca libro "${slug}" nel DB Notion...`);
  const res = await fetch(
    `https://api.notion.com/v1/databases/${BOOKS_DB_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
      },
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.warn(`⚠️  Notion DB query fallita (${res.status}): ${err}`);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: { results: any[] } = await res.json();
  const page = data.results.find((p) => {
    const title: string =
      p.properties?.Titolo?.title?.[0]?.plain_text ?? "";
    return slugify(title) === slug;
  });

  if (!page) {
    console.warn(`⚠️  Libro con slug "${slug}" non trovato in Notion.`);
    return null;
  }

  return fetchAmazonFromPage(notionKey, page.id);
}

async function fetchAmazonFromPage(
  notionKey: string,
  pageId: string
): Promise<string | null> {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      Authorization: `Bearer ${notionKey}`,
      "Notion-Version": NOTION_VERSION,
    },
  });

  if (!res.ok) {
    console.warn(`⚠️  Pagina Notion ${pageId} non accessibile (${res.status}).`);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page: any = await res.json();
  const amazonUrl: string | null =
    page.properties?.["Amazon Link"]?.url ?? null;

  if (amazonUrl) {
    console.log(`🔗  Amazon Link: ${amazonUrl}`);
  } else {
    console.log("ℹ️   Amazon Link non presente in Notion — il bottone sarà omesso.");
  }

  return amazonUrl;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function generatePdf() {
  console.log(`📖  Lettura template: ${templatePath}`);
  let html = fs.readFileSync(templatePath, "utf-8");

  // Iniezione Amazon Link da Notion (solo se il template usa il placeholder)
  const hasPlaceholder = html.includes('href="AMAZON_PLACEHOLDER"');
  if (hasPlaceholder) {
    const notionKey = process.env.NOTION_API_KEY;
    if (notionKey) {
      const amazonUrl = await getAmazonLink(notionKey);
      if (amazonUrl) {
        html = html.replace('href="AMAZON_PLACEHOLDER"', `href="${amazonUrl}"`);
      } else {
        // Rimuove il div amazon-btn-wrap se link assente
        html = html.replace(
          /<div class="amazon-btn-wrap">[\s\S]*?<\/div>\s*<\/div>/,
          ""
        );
      }
    } else {
      console.warn("⚠️  NOTION_API_KEY non configurata — Amazon Link skippato.");
      html = html.replace(
        /<div class="amazon-btn-wrap">[\s\S]*?<\/div>\s*<\/div>/,
        ""
      );
    }
  } else {
    console.log("ℹ️   Amazon Link già presente nel template — nessuna sostituzione necessaria.");
  }

  console.log("🚀  Avvio Puppeteer...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  console.log("📄  Generazione PDF...");
  fs.mkdirSync(outputDir, { recursive: true });

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  await browser.close();

  const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`✅  PDF salvato: ${outputPath} (${sizeKb} KB)`);
}

generatePdf().catch((err) => {
  console.error("❌  Errore durante la generazione:", err);
  process.exit(1);
});
