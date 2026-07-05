/**
 * auto-genera-spremuta.ts
 *
 * Cron script che processa libri pendenti in Notion:
 *   - "Genera Spremuta" = true
 *   - "Link PDF" = vuoto
 *
 * Per ogni libro:
 *   1. Legge metadati da Notion
 *   2. Se manca Amazon Link → costruisce URL ricerca con tag affiliato
 *   3. Se manca Cover Image → cerca su Open Library
 *   4. Chiama Claude Sonnet API → genera SpremutaContent JSON
 *   5. Genera PDF con Puppeteer
 *   6. Git commit + push (Vercel autodeploy)
 *   7. Aggiorna Notion (Link PDF, Cover Image, Amazon Link)
 *   8. Deseleziona checkbox "Genera Spremuta"
 *
 * Usage:
 *   npx tsx scripts/auto-genera-spremuta.ts
 *
 * Richiede in .env.local:
 *   NOTION_API_KEY
 *   ANTHROPIC_API_KEY
 */

import fs from "fs";
import path from "path";
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
loadEnv(ROOT);

const NOTION_KEY = process.env.NOTION_API_KEY ?? "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const BOOKS_DB_ID = "0daef582d259833da7bb014a34479f60";
const NOTION_VERSION = "2022-06-28";
const TEMPLATE_PATH = path.join(ROOT, "templates", "spremute", "TEMPLATE.html");
const OUTPUT_DIR = path.join(ROOT, "public", "spremute");
const COVERS_DIR = path.join(ROOT, "public", "covers");
const AMAZON_TAG = "omarbortolato-21";
const CLAUDE_MODEL = "claude-sonnet-4-5";

if (!NOTION_KEY) throw new Error("NOTION_API_KEY mancante in .env.local");
if (!ANTHROPIC_KEY) throw new Error("ANTHROPIC_API_KEY mancante in .env.local");

// ─── Notion helpers ───────────────────────────────────────────────────────────

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

function rt(arr: { plain_text: string }[] | undefined): string {
  return (arr ?? []).map((r) => r.plain_text).join("");
}

// ─── Tipi ────────────────────────────────────────────────────────────────────

interface PendingBook {
  id: string;
  title: string;
  author: string;
  category: string;
  amazonLink: string | null;
  coverImage: string | null;
  isbn: string | null;
}

// ─── Query libri pendenti ─────────────────────────────────────────────────────

async function queryPending(): Promise<PendingBook[]> {
  const res = await fetch(`https://api.notion.com/v1/databases/${BOOKS_DB_ID}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Genera Spremuta", checkbox: { equals: true } },
          { property: "Link PDF", url: { is_empty: true } },
        ],
      },
      page_size: 10,
    }),
  });
  if (!res.ok) throw new Error(`Notion query failed: ${await res.text()}`);
  const data = await res.json() as { results: unknown[] };

  return data.results.map((r: unknown) => {
    const page = r as { id: string; properties: Record<string, unknown> };
    const props = page.properties;
    const title = rt((props.Titolo as { title: { plain_text: string }[] })?.title);
    const author = rt((props.Autore as { rich_text: { plain_text: string }[] })?.rich_text);
    const category = (props.Categoria as { select: { name: string } })?.select?.name ?? "";
    const amazonLink = (props["Amazon Link"] as { url: string | null })?.url ?? null;
    const coverImage = (props["Cover Image"] as { url: string | null })?.url ?? null;

    // ISBN può essere in un campo Note o Script Claude Code come fallback
    const notes = rt((props.Note as { rich_text: { plain_text: string }[] })?.rich_text ?? []);
    const isbnMatch = notes.match(/isbn[:\s]*([0-9Xx-]{10,17})/i);
    const isbn = isbnMatch ? isbnMatch[1].replace(/-/g, "") : null;

    return { id: page.id, title, author, category, amazonLink, coverImage, isbn };
  });
}

// ─── Amazon link ──────────────────────────────────────────────────────────────

function buildAmazonSearchUrl(title: string, author: string): string {
  const q = encodeURIComponent(`${title} ${author}`.trim());
  return `https://www.amazon.it/s?k=${q}&tag=${AMAZON_TAG}`;
}

// ─── Open Library cover ───────────────────────────────────────────────────────

async function findOpenLibraryCover(
  title: string,
  author: string,
  isbn: string | null
): Promise<string | null> {
  // 1. Prova per ISBN
  if (isbn) {
    const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok && (res.headers.get("content-type") ?? "").startsWith("image")) {
        return url;
      }
    } catch { /* ignora */ }
  }

  // 2. Prova per titolo via Search API (prima in italiano, poi solo per autore)
  const authorLastName = author.split(" ").pop() ?? author;
  const searches = [
    `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=10`,
    `https://openlibrary.org/search.json?author=${encodeURIComponent(authorLastName)}&limit=20`,
  ];

  for (const searchUrl of searches) {
    try {
      const res = await fetch(searchUrl);
      if (!res.ok) continue;
      const data = await res.json() as { docs: { title: string; author_name?: string[]; cover_i?: number; isbn?: string[] }[] };
      const authorLower = authorLastName.toLowerCase();
      const match = data.docs.find((d) => {
        const authors = (d.author_name ?? []).join(" ").toLowerCase();
        return authors.includes(authorLower) && d.cover_i;
      });
      if (match?.cover_i) {
        return `https://covers.openlibrary.org/b/id/${match.cover_i}-L.jpg`;
      }
      if (match?.isbn?.length) {
        const isbnCover = `https://covers.openlibrary.org/b/isbn/${match.isbn[0]}-L.jpg`;
        const check = await fetch(isbnCover, { method: "HEAD" });
        if (check.ok) return isbnCover;
      }
    } catch { /* ignora */ }
  }

  return null;
}

// ─── Salva cover localmente ───────────────────────────────────────────────────

async function downloadCover(url: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image")) return null;
    const ext = ct.includes("png") ? "png" : "jpg";
    const filename = `${slug}.${ext}`;
    const dest = path.join(COVERS_DIR, filename);
    fs.mkdirSync(COVERS_DIR, { recursive: true });
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return `/covers/${filename}`;
  } catch {
    return null;
  }
}

// ─── Genera contenuto via Claude API ─────────────────────────────────────────

async function generateContent(book: PendingBook): Promise<SpremutaContent> {
  const prompt = `Sei Omar Bortolato, imprenditore e AI Manager italiano.
Devi scrivere la "Spremuta" del libro "${book.title}" di ${book.author} (categoria: ${book.category || "Business/Crescita personale"}).

Una Spremuta non è un riassunto — è una rielaborazione personale: quello che Omar ha capito, applicato, e trasformato in azione. Tono diretto, conversazionale, italiano, senza accademismi.

Genera un JSON con questa struttura esatta (nessun campo opzionale):

{
  "intro": "2-3 frasi su come Omar ha incontrato questo libro e perché vale il tempo del lettore. Personale e diretto.",
  "libro_90s": "Il libro spiegato in 90 secondi: di cosa parla, qual è la tesi centrale, perché è importante. 3-5 frasi.",
  "idee": [
    {
      "emoji": "emoji rilevante",
      "titolo": "Titolo breve dell'idea (max 6 parole)",
      "testo": "2-3 frasi che spiegano l'idea e come Omar l'ha interpretata/applicata."
    }
  ],
  "azioni": [
    {
      "numero": 1,
      "titolo": "Azione concreta (max 6 parole, verbo all'infinito)",
      "testo": "Come applicarla nella pratica. 2-3 frasi specifiche.",
      "ai_tip": "Come l'AI può aiutare in questa azione specifica. 1-2 frasi pratiche."
    }
  ],
  "ai_regge": "Cosa del libro rimane vero/rilevante nell'era dell'AI. 2-3 frasi.",
  "ai_cambia": "Cosa il libro NON aveva previsto e che l'AI sta cambiando. 2-3 frasi.",
  "ai_insight": "La connessione più interessante tra le idee del libro e l'AI oggi. 2-3 frasi.",
  "citazione": "La citazione più potente del libro (o una frase che lo rappresenta).",
  "citazione_fonte": "${book.author}, ${book.title}",
  "libri_correlati": [
    {
      "titolo": "Titolo libro correlato",
      "autore": "Autore",
      "perche": "Una frase su perché leggerlo dopo questo."
    }
  ]
}

Regole:
- idee: esattamente 5 elementi
- azioni: esattamente 5 elementi
- libri_correlati: esattamente 3 elementi
- Tutto in italiano, eccetto titoli di libri in inglese che rimangono in inglese
- Niente markdown, solo testo piano nei campi stringa
- Accenti corretti (à, è, é, ì, ò, ù)
- Rispondi SOLO con il JSON, niente altro`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error (${res.status}): ${err}`);
  }

  const data = await res.json() as { content: { type: string; text: string }[] };
  const text = data.content.find((c) => c.type === "text")?.text ?? "";

  // Estrae il JSON dalla risposta (potrebbe avere ```json ... ```)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) ??
                    text.match(/```\s*([\s\S]*?)```/) ??
                    text.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;

  try {
    return JSON.parse(jsonStr.trim()) as SpremutaContent;
  } catch (e) {
    throw new Error(`JSON parse failed. Response was:\n${text}\n\nError: ${e}`);
  }
}

// ─── Aggiorna Notion ──────────────────────────────────────────────────────────

async function updateNotion(
  pageId: string,
  pdfPath: string,
  coverUrl: string | null,
  amazonUrl: string | null
): Promise<void> {
  const props: Record<string, unknown> = {
    "Link PDF": { url: pdfPath },
    "Genera Spremuta": { checkbox: false },
  };
  if (coverUrl) props["Cover Image"] = { url: coverUrl };
  if (amazonUrl) props["Amazon Link"] = { url: amazonUrl };

  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({ properties: props }),
  });
  if (!res.ok) throw new Error(`Notion PATCH failed: ${await res.text()}`);
}

// ─── Git push ─────────────────────────────────────────────────────────────────

function gitPush(slug: string, hasCover: boolean): void {
  const files = [`public/spremute/${slug}.pdf`];
  if (hasCover) files.push(`public/covers/${slug}.jpg`, `public/covers/${slug}.png`);

  // Aggiungi solo i file che esistono
  for (const f of files) {
    const full = path.join(ROOT, f);
    if (fs.existsSync(full)) {
      execSync(`git -C "${ROOT}" add "${f}"`, { stdio: "pipe" });
    }
  }

  try {
    execSync(
      `git -C "${ROOT}" commit -m "auto: spremuta ${slug}"`,
      { stdio: "pipe" }
    );
    execSync(`git -C "${ROOT}" push origin main`, { stdio: "pipe" });
    console.log(`  ✓ git push (${slug})`);
  } catch (e) {
    // Se non ci sono diff git non va in errore bloccante
    const msg = (e as { stderr?: Buffer }).stderr?.toString() ?? "";
    if (!msg.includes("nothing to commit")) {
      throw e;
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[auto-genera-spremuta] ${new Date().toISOString()}`);

  const pending = await queryPending();
  if (pending.length === 0) {
    console.log("  Nessun libro pendente.");
    return;
  }

  console.log(`  Libri pendenti: ${pending.length}`);
  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const book of pending) {
    console.log(`\n→ "${book.title}" (${book.id})`);
    let errors: string[] = [];

    try {
      const slug = makeSlug(book.title);

      // 1. Amazon link
      let amazonUrl = book.amazonLink;
      if (!amazonUrl) {
        amazonUrl = buildAmazonSearchUrl(book.title, book.author);
        console.log(`  Amazon: costruito URL ricerca`);
      }

      // 2. Cover image
      let coverUrl = book.coverImage;
      let newCoverPath: string | null = null;
      if (!coverUrl) {
        console.log(`  Cover: cercando su Open Library...`);
        const olUrl = await findOpenLibraryCover(book.title, book.author, book.isbn);
        if (olUrl) {
          newCoverPath = await downloadCover(olUrl, slug);
          coverUrl = newCoverPath;
          console.log(`  Cover: trovata → ${coverUrl}`);
        } else {
          console.log(`  Cover: non trovata su Open Library`);
        }
      }

      // 3. Genera contenuto con Claude
      console.log(`  Claude: generando contenuto...`);
      const content = await generateContent(book);
      console.log(`  Claude: OK`);

      // 4. Genera PDF
      const bookData: BookData = {
        title: book.title,
        author: book.author,
        category: book.category,
        amazonLink: amazonUrl,
      };
      const html = fillTemplate(template, bookData, content);
      const pdfPath = path.join(OUTPUT_DIR, `${slug}.pdf`);
      await generatePdf(html, pdfPath);
      console.log(`  PDF: generato → ${pdfPath}`);

      // 5. Git push
      gitPush(slug, !!newCoverPath);

      // 6. Aggiorna Notion
      const pdfNotionUrl = `/spremute/${slug}.pdf`;
      await updateNotion(book.id, pdfNotionUrl, coverUrl, book.amazonLink ? null : amazonUrl);
      console.log(`  Notion: aggiornato`);

    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(msg);
      console.error(`  ERRORE: ${msg}`);
    }
  }

  console.log("\n[auto-genera-spremuta] completato");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
