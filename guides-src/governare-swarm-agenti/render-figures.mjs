/**
 * render-figures.mjs — esporta ogni figures/*.svg in PNG a risoluzione di stampa.
 *
 * I sorgenti SVG restano la fonte di verità e sono riutilizzabili da soli.
 * Il PNG serve per la stampa e per il riuso fuori dal PDF (slide, post, landing).
 *
 *   node render-figures.mjs            → tutte
 *   node render-figures.mjs fig-1      → solo quelle che contengono "fig-1"
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const FIG = path.join(DIR, "figures");
const OUT = path.join(FIG, "png");
const DPI_SCALE = 300 / 96; // 300 dpi partendo dai px CSS a 96 dpi

const fontCss = [
  fs.readFileSync(path.join(DIR, "fonts/inter-embedded.css"), "utf-8"),
  fs.readFileSync(path.join(DIR, "fonts/mono-embedded.css"), "utf-8"),
].join("\n");

const filter = process.argv[2] ?? "";
const files = fs
  .readdirSync(FIG)
  .filter((f) => f.endsWith(".svg") && f.includes(filter))
  .sort();

if (!files.length) {
  console.error(`Nessun SVG corrispondente a "${filter}" in ${FIG}`);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
});

try {
  for (const file of files) {
    const svg = fs.readFileSync(path.join(FIG, file), "utf-8");
    const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) ?? [];
    if (!w) {
      console.warn(`· ${file} — viewBox non trovato, salto`);
      continue;
    }

    const page = await browser.newPage();
    await page.setViewport({
      width: Math.ceil(Number(w)),
      height: Math.ceil(Number(h)),
      deviceScaleFactor: DPI_SCALE,
    });
    await page.setContent(
      `<style>${fontCss}
       html,body{margin:0;padding:0;background:#fff}
       svg{display:block}</style>${svg}`,
      { waitUntil: "load" }
    );
    await page.evaluate(() => document.fonts.ready);

    const out = path.join(OUT, file.replace(/\.svg$/, ".png"));
    await page.screenshot({ path: out, omitBackground: false });
    await page.close();
    console.log(`✓ ${file} → png/${path.basename(out)}  (${w}×${h} @300dpi)`);
  }
} finally {
  await browser.close();
}
