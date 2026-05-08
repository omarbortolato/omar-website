/**
 * lib/pdf-generator.ts
 * Helper condiviso per la generazione PDF delle Spremute.
 * Usato da: scripts/generate-pdf.ts, scripts/generate-all-pending.ts,
 *           scripts/spremuta.ts
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SpremutaContent {
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

export interface BookData {
  title: string;
  author: string;
  category: string;
  amazonLink: string | null;
}

// ─── Slug ─────────────────────────────────────────────────────────────────────

export function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[àáâã]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõ]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

// ─── Env loader ───────────────────────────────────────────────────────────────

export function loadEnv(root: string): void {
  const envPath = path.join(root, ".env.local");
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

// ─── Template fill ────────────────────────────────────────────────────────────

export function fillTemplate(
  template: string,
  book: BookData,
  content: SpremutaContent
): string {
  let html = template;

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Cover
  html = html.replace(/\{\{BOOK_TITLE\}\}/g, esc(book.title));
  html = html.replace(/\{\{BOOK_AUTHOR\}\}/g, esc(book.author));
  html = html.replace(/\{\{BOOK_CATEGORY\}\}/g, esc(book.category));

  // Sec 1
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
    html = html.replace(/<div class="amazon-btn-wrap">[\s\S]*?<\/div>/m, "");
  }

  return html;
}

// ─── PDF generation ───────────────────────────────────────────────────────────

export async function generatePdf(html: string, outputPath: string): Promise<void> {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
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
