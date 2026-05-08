/**
 * generate-pdf.ts
 * Genera un PDF da un template HTML nella cartella templates/spremute/.
 *
 * Usage:
 *   npx tsx scripts/generate-pdf.ts mastery-robert-greene
 *
 * Input:  templates/spremute/[slug].html
 * Output: public/spremute/[slug].pdf
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const slug = process.argv[2];

if (!slug) {
  console.error("❌  Fornisci lo slug del libro come argomento.");
  console.error("   Esempio: npx tsx scripts/generate-pdf.ts mastery-robert-greene");
  process.exit(1);
}

const ROOT = path.resolve(__dirname, "..");
const templatePath = path.join(ROOT, "templates", "spremute", `${slug}.html`);
const outputDir = path.join(ROOT, "public", "spremute");
const outputPath = path.join(outputDir, `${slug}.pdf`);

if (!fs.existsSync(templatePath)) {
  console.error(`❌  Template non trovato: ${templatePath}`);
  process.exit(1);
}

async function generatePdf() {
  console.log(`📖  Lettura template: ${templatePath}`);
  const html = fs.readFileSync(templatePath, "utf-8");

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
