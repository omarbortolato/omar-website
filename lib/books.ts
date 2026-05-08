// ─── Notion Books utility ─────────────────────────────────────────────────────
// Reads books from the Notion Libri database.
// No Notion SDK — plain fetch with revalidation (same pattern as notion.ts).

import { generateSlug } from "./notion";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const BOOKS_DB_ID = "0daef582d259833da7bb014a34479f60";
const NOTION_VERSION = "2022-06-28";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  year: number | null;
  rating: string | null; // "😍 TOP" | "🙂 buono" | "😣 scarso"
  pdfUrl: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

function extractRichText(rich: { plain_text: string }[]): string {
  if (!Array.isArray(rich)) return "";
  return rich.map((r) => r.plain_text).join("");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBook(page: any): Book {
  const props = page.properties;

  const title = extractRichText(props?.Titolo?.title ?? []);
  const author = extractRichText(props?.Autore?.rich_text ?? []);
  const category: string = props?.Categoria?.select?.name ?? "";
  const year: number | null = props?.["Anno lettura"]?.number ?? null;
  const rating: string | null = props?.Voto?.select?.name ?? null;
  const pdfUrl: string | null = props?.["Link PDF"]?.url ?? null;

  return {
    id: page.id,
    title,
    slug: generateSlug(title),
    author,
    category,
    year,
    rating,
    pdfUrl,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getBooks(): Promise<Book[]> {
  if (!NOTION_API_KEY) return [];

  const res = await fetch(
    `https://api.notion.com/v1/databases/${BOOKS_DB_ID}/query`,
    {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        sorts: [
          {
            property: "Anno lettura",
            direction: "descending",
          },
        ],
      }),
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.results ?? [])
    .map(parseBook)
    .filter((b: Book) => b.title);
}

export async function getBook(slug: string): Promise<Book | null> {
  const books = await getBooks();
  return books.find((b) => b.slug === slug) ?? null;
}
