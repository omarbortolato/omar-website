import fs from "fs";
import path from "path";
import { loadEnv, makeSlug, fillTemplate, generatePdf, SpremutaContent, BookData } from "../lib/pdf-generator";

const ROOT = process.cwd();
loadEnv(ROOT);

const TEMPLATE_PATH = path.join(ROOT, "templates", "spremute", "TEMPLATE.html");
const CONTENT_DIR = "/tmp/spremute-content";
const OUTPUT_DIR = path.join(ROOT, "public", "spremute");

const allBooks: Array<{ id: string; title: string; author: string; category: string; amazon: string | null }> =
  JSON.parse(fs.readFileSync("/tmp/all_books.json", "utf-8"));

const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));

async function main() {
  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    const book = allBooks.find((b) => makeSlug(b.title) === slug);
    if (!book) {
      console.error(`SKIP: no book found for slug ${slug}`);
      continue;
    }
    const content: SpremutaContent = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8"));
    const bookData: BookData = {
      title: book.title,
      author: book.author,
      category: book.category,
      amazonLink: book.amazon,
    };
    const html = fillTemplate(template, bookData, content);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.pdf`);
    await generatePdf(html, outputPath);
    const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(`OK: ${slug}.pdf (${sizeKb} KB)`);
  }
}

main();
