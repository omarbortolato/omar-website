/**
 * build.mjs — compone guida.html in un PDF A4 impaginato.
 *
 * Cosa fa, in ordine:
 *   1. inlina i font (Inter + Geist Mono) come data URI, così il PDF è autonomo
 *   2. inlina gli SVG di figures/ nei <div data-svg="...">
 *   3. inietta testatina e numero su ogni pagina (le pagine non li scrivono a mano)
 *   4. verifica che nessuna pagina trabocchi, e lo dice invece di tagliare in silenzio
 *   5. esporta il PDF e le due pagine di anteprima per la landing
 *
 *   node build.mjs            → PDF + anteprime
 *   node build.mjs --check    → solo il controllo di traboccamento, niente file
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, "../..");

const TITLE = "Governare uno swarm di agenti";
const OUT_PDF = path.join(ROOT, "public/downloads/governare-swarm-agenti.pdf");
const OUT_PREVIEW = path.join(ROOT, "public/images/guide");

const checkOnly = process.argv.includes("--check");

// ── composizione dell'HTML ───────────────────────────────────────────────────

const fontCss = [
  fs.readFileSync(path.join(DIR, "fonts/inter-embedded.css"), "utf-8"),
  fs.readFileSync(path.join(DIR, "fonts/mono-embedded.css"), "utf-8"),
].join("\n");
const styleCss = fs.readFileSync(path.join(DIR, "style.css"), "utf-8");

let body = fs.readFileSync(path.join(DIR, "guida.html"), "utf-8");

// gli SVG entrano nel documento come markup, non come immagini: restano vettoriali
body = body.replace(/<div data-svg="([^"]+)"><\/div>/g, (_, file) => {
  const p = path.join(DIR, "figures", file);
  if (!fs.existsSync(p)) throw new Error(`Figura mancante: ${file}`);
  return fs.readFileSync(p, "utf-8").replace(/<\?xml[^>]*\?>/, "");
});

const html = `<!doctype html><html lang="it"><head><meta charset="utf-8">
<title>${TITLE}</title>
<style>${fontCss}</style>
<style>${styleCss}</style>
</head><body>${body}</body></html>`;

// ── render ───────────────────────────────────────────────────────────────────

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
});
const page = await browser.newPage();
await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);

// testatina e numero di pagina, iniettati una volta sola qui
const meta = await page.evaluate((title) => {
  const pages = [...document.querySelectorAll(".page")];
  pages.forEach((el, i) => {
    if (el.dataset.nohead === undefined) {
      const head = document.createElement("header");
      head.className = "rh";
      head.innerHTML = `<span>${el.dataset.chap ?? title}</span><strong>omarbortolato.it</strong>`;
      el.prepend(head);

      const foot = document.createElement("footer");
      foot.className = "pf";
      foot.textContent = String(i + 1);
      el.append(foot);
    }
  });

  // traboccamento: il corpo della pagina non deve superare il suo contenitore
  const over = [];
  const light = [];
  pages.forEach((el, i) => {
    const pb = el.querySelector(".pb");
    if (!pb || el.classList.contains("cover")) return;
    const slack = pb.scrollHeight - pb.clientHeight;
    if (slack > 1) over.push({ page: i + 1, px: slack, chap: el.dataset.chap ?? "—" });
    const fill = pb.scrollHeight / pb.clientHeight;
    if (fill < 0.72) light.push({ page: i + 1, fill: Math.round(fill * 100), chap: el.dataset.chap ?? "—" });
  });
  return { count: pages.length, over, light };
}, TITLE);

console.log(`Pagine: ${meta.count}`);
if (meta.over.length) {
  console.log("\n⚠  Pagine che traboccano:");
  for (const o of meta.over) console.log(`   p.${o.page}  +${o.px}px  (${o.chap})`);
} else {
  console.log("Nessuna pagina trabocca.");
}
if (meta.light.length) {
  console.log("\n·  Pagine poco piene:");
  for (const l of meta.light) console.log(`   p.${l.page}  ${l.fill}%  (${l.chap})`);
}

if (!checkOnly) {
  fs.mkdirSync(path.dirname(OUT_PDF), { recursive: true });
  fs.mkdirSync(OUT_PREVIEW, { recursive: true });

  await page.pdf({
    path: OUT_PDF,
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false,
  });
  console.log(`\n✓ PDF → ${path.relative(ROOT, OUT_PDF)}`);

  // anteprima per la landing: copertina + una pagina di contenuto con figura
  for (const [n, name] of [[1, "anteprima-1"], [15, "anteprima-2"]]) {
    const el = await page.$(`.page:nth-of-type(${n})`);
    if (!el) continue;
    await el.screenshot({ path: path.join(OUT_PREVIEW, `${name}.png`) });
    console.log(`✓ anteprima p.${n} → public/images/guide/${name}.png`);
  }
}

await browser.close();
if (meta.over.length) process.exitCode = 1;
