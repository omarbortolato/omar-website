/**
 * _shared/build.mjs — compone una guida in PDF A4 impaginato.
 *
 * Uso:
 *   node _shared/build.mjs <cartella-guida> [--check]
 *
 * Ogni guida è una cartella con:
 *   meta.json       titolo, slug, prefisso delle anteprime, pagine da esportare
 *   guida.html      impaginazione a pagine fisse: ogni <section class="page"> è una A4
 *   style-extra.css facoltativo, stili specifici della guida
 *   figures/*.svg   facoltativo, inlinati nei <div data-svg="...">
 *
 * Font e sistema di design stanno qui in _shared/ e valgono per tutte le guide:
 * se cambia il brand, cambia in un posto solo.
 *
 * Cosa fa, in ordine:
 *   1. inlina i font (Inter + Geist Mono) come data URI, così il PDF è autonomo
 *   2. inlina gli SVG di figures/ nei <div data-svg="...">
 *   3. inietta testatina e numero su ogni pagina (le pagine non li scrivono a mano)
 *   4. verifica che nessuna pagina trabocchi, e lo dice invece di tagliare in silenzio
 *   5. esporta il PDF e le pagine di anteprima per la landing
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SHARED = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(SHARED, "..");
const ROOT = path.resolve(SRC_ROOT, "..");

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const dirName = args.find((a) => !a.startsWith("--"));

if (!dirName) {
  console.error("Uso: node _shared/build.mjs <cartella-guida> [--check]");
  process.exit(1);
}

const DIR = path.join(SRC_ROOT, dirName);
if (!fs.existsSync(path.join(DIR, "meta.json"))) {
  console.error(`meta.json mancante in ${dirName}/`);
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(path.join(DIR, "meta.json"), "utf-8"));
const OUT_PDF = path.join(ROOT, "public/downloads", `${meta.slug}.pdf`);
const OUT_PREVIEW = path.join(ROOT, "public/images/guide");

// ── composizione dell'HTML ───────────────────────────────────────────────────

const fontCss = [
  fs.readFileSync(path.join(SHARED, "fonts/inter-embedded.css"), "utf-8"),
  fs.readFileSync(path.join(SHARED, "fonts/mono-embedded.css"), "utf-8"),
].join("\n");

const styleCss = fs.readFileSync(path.join(SHARED, "style.css"), "utf-8");
const extraPath = path.join(DIR, "style-extra.css");
const extraCss = fs.existsSync(extraPath) ? fs.readFileSync(extraPath, "utf-8") : "";

let body = fs.readFileSync(path.join(DIR, "guida.html"), "utf-8");

// gli SVG entrano nel documento come markup, non come immagini: restano vettoriali
body = body.replace(/<div data-svg="([^"]+)"><\/div>/g, (_, file) => {
  const p = path.join(DIR, "figures", file);
  if (!fs.existsSync(p)) throw new Error(`Figura mancante: ${file}`);
  return fs.readFileSync(p, "utf-8").replace(/<\?xml[^>]*\?>/, "");
});

const html = `<!doctype html><html lang="it"><head><meta charset="utf-8">
<title>${meta.title}</title>
<style>${fontCss}</style>
<style>${styleCss}</style>
<style>${extraCss}</style>
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

const report = await page.evaluate((title) => {
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

  const over = [];
  const light = [];
  pages.forEach((el, i) => {
    const pb = el.querySelector(".pb");
    if (!pb || el.classList.contains("cover")) return;

    const slack = pb.scrollHeight - pb.clientHeight;
    if (slack > 1) over.push({ page: i + 1, px: slack, chap: el.dataset.chap ?? "—" });

    // Quanto della pagina è davvero occupato. NON si può usare scrollHeight: per un
    // contenuto più corto del contenitore vale sempre clientHeight, quindi il rapporto
    // sarebbe 1 anche su una pagina mezza vuota. Serve il fondo dell'ultimo figlio.
    const kids = [...pb.children];
    const last = kids[kids.length - 1];
    if (!last) return;
    const used = last.getBoundingClientRect().bottom - pb.getBoundingClientRect().top;
    const fill = used / pb.clientHeight;
    if (fill < 0.75) light.push({ page: i + 1, fill: Math.round(fill * 100), chap: el.dataset.chap ?? "—" });
  });
  return { count: pages.length, over, light };
}, meta.title);

console.log(`${dirName} — pagine: ${report.count}`);
if (report.over.length) {
  console.log("\n⚠  Pagine che traboccano:");
  for (const o of report.over) console.log(`   p.${o.page}  +${o.px}px  (${o.chap})`);
} else {
  console.log("Nessuna pagina trabocca.");
}
if (report.light.length) {
  console.log("\n·  Pagine poco piene:");
  for (const l of report.light) console.log(`   p.${l.page}  ${l.fill}%  (${l.chap})`);
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

  for (const [i, n] of (meta.previewPages ?? []).entries()) {
    const el = await page.$(`.page:nth-of-type(${n})`);
    if (!el) { console.warn(`· anteprima p.${n} non trovata`); continue; }
    const name = `${meta.previewPrefix}-${i + 1}.png`;
    await el.screenshot({ path: path.join(OUT_PREVIEW, name) });
    console.log(`✓ anteprima p.${n} → public/images/guide/${name}`);
  }
}

await browser.close();
if (report.over.length) process.exitCode = 1;
