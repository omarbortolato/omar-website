# Omar Bortolato - Personal Website & AI Business Platform

## Project Vision
Professional personal website positioning Omar Bortolato as Italy's leading AI Practitioner. The site showcases real AI projects, provides practical guides, and serves as lead generation engine for consulting, speaking, and business ventures.

Long-term vision: Evolve into AI-powered business platform with courses, ecommerce demos, startup showcases - all demonstrating practical AI implementation.

## Core Positioning
"AI pratica per chi vuole fare, non solo sapere"
- Show, don't tell (real projects documented)
- Human-centered AI (amplifies people, doesn't replace)
- Accessible language (zero jargon)
- Authentic (shares failures and iterations)
- Built with AI (proof of concept)

## Tech Stack
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- Language: TypeScript
- Hosting: Vercel (auto-deploy) — dominio custom omarbortolato.it
- Version Control: GitHub (public repo)
- Development: Claude Code + Claude.ai Projects
- Icons: Lucide React
- Font: Inter (Google Fonts)
- n8n self-hosted 2.9.4 — https://wf.n8n.herbago.it

## Repository Info
- GitHub: https://github.com/omarbortolato/omar-website
- Live Site: https://www.omarbortolato.it
- Vercel: https://vercel.com/omarbortolatos-projects/omarbortolato-site

## Design System
Colors:
- Primary: #1E3A8A (navy blue) - headers, primary CTA
- Accent: #F59E0B (amber orange) - highlights, secondary CTA
- Text: #111827 (dark), #6B7280 (gray)
- Background: #F9FAFB (light), #FFFFFF (white)

Typography: Inter (all weights)
Components: Clean cards, subtle shadows, generous whitespace
Tone: Personal storytelling, not corporate

## Project Structure
```
app/
├─ layout.tsx              # Root layout (Header + Footer)
├─ page.tsx                # Homepage ✅
├─ about/page.tsx          # About page ✅
├─ progetti/page.tsx       # Projects portfolio ✅
├─ blog/page.tsx           # Blog listing ✅ (Notion CMS)
├─ blog/[slug]/page.tsx    # Blog article ✅ (Notion CMS)
└─ collabora/page.tsx      # Contact/collaboration ✅ (Cal.com attivo)
components/
├─ layout/
│  ├─ Header.tsx           # Navigation
│  └─ Footer.tsx           # Social links
└─ ui/
   ├─ cover-image.tsx      # Client component — cover articolo con onError
   └─ (shadcn components)
lib/
└─ notion.ts               # Notion API utility ✅
public/
├─ images/                 # Immagini statiche sito
└─ post-images/            # Cover image articoli blog (nome file da Notion)
```

## Current Status (aggiornato 15 aprile 2026)
- Homepage live ✅
- About page live ✅
- Progetti page live ✅
- Blog live con Notion CMS ✅
- Collabora page live con Cal.com ✅
- Cover image articoli (locale + URL esterno) ✅
- Campo Blog URL compilato automaticamente da WRITE_ARTICLE ✅
- Pipeline content E2E testata e funzionante ✅
- Redesign globale 🔮 (dopo che il contenuto è stabile)

## Notion CMS (Blog)

Il blog usa Notion come CMS. n8n genera i contenuti, il sito legge via Notion API.

### Database Content Inbox
- ID: `2cfef582-d259-806b-a7a6-efc8bff25a68`
- Env variable: `NOTION_API_KEY` (configurata su Vercel)
- Filter: `Status = "Blog Published"` — solo questi appaiono sul sito
- Sort: Published Date descending
- Revalidate: 300 secondi (5 minuti)

### Schema campi usati dal sito
| Campo                  | Tipo         | Uso                                          |
|------------------------|--------------|----------------------------------------------|
| Title                  | title        | Titolo articolo                              |
| Status                 | select       | Filtro: solo "Blog Published" appare sul sito |
| Blog Abstract          | rich_text    | Excerpt card e articolo                      |
| Cover Image URL        | url          | Nome file locale o URL esterno               |
| Meta Title             | rich_text    | SEO `<title>`                                |
| Meta Description       | rich_text    | SEO `<meta description>`                     |
| Tags                   | multi_select | Badge categoria                              |
| Published Date         | date         | Data pubblicazione                           |
| Blog URL               | url          | Compilata automaticamente da WRITE_ARTICLE   |

### Valori Status (flusso completo)
`IDEA → Ready to Generate → LinkedIn Published → Blog Published → ⚠️ Need Review`

### lib/notion.ts — funzioni esportate
```typescript
interface BlogPost {
  id: string
  title: string
  slug: string        // generato da Title a runtime
  abstract: string
  content: string     // HTML da block Notion
  coverImage: string | null
  tags: string[]
  publishedDate: string
  metaTitle: string
  metaDescription: string
}

export async function getBlogPosts(): Promise<BlogPost[]>
export async function getBlogPost(slug: string): Promise<BlogPost | null>
export function generateSlug(title: string): string
export function buildBlogUrl(title: string): string  // https://www.omarbortolato.it/blog/{slug}
```

### Note tecniche
- Body articolo: letto dai block Notion (paragraph, heading_2, heading_3, quote, code, list)
- Notion API header: `"Notion-Version": "2022-06-28"`
- Cover image: se nome file → `/post-images/{filename}`, se URL esterno → usato direttamente
- Cover image: validata per estensione (.jpg .jpeg .png .webp .gif), null altrimenti
- Slug: lowercase, rimuove diacritici e caratteri speciali (apostrofi rimossi, non trattino)
- `@tailwindcss/typography` installato per prose styling

## Content Pipeline (stato LIVE)
```
INPUT
├── Telegram → n8n → Content Inbox (status: IDEA)
└── Gmail tag → Signals Inbox

      ↓ Ogni lunedì ore 7

Weekly Editorial Planner (n8n)
→ GPT-4.1 propone 3 idee → Telegram con bottoni 1/2/3

      ↓ Omar sceglie e aggiunge Raw Notes → status "Ready to Generate"

Trigger 1 — webhook n8n
→ OpenAI GPT-4.1-mini: LinkedIn post, hashtag, image prompt, meta, tags
→ Notifica Telegram con link pagina

      ↓ Omar pubblica su LinkedIn → status "LinkedIn Published"

Trigger 2 — webhook n8n
→ Claude Sonnet genera Markdown
→ Manda page_id via Telegram: "WRITE_ARTICLE: {page_id}"

      ↓ Omar scrive WRITE_ARTICLE in Claude.ai

Claude legge pagina, scrive body via MCP, compila Blog URL

      ↓ Omar revisiona → status "Blog Published"

Sito aggiornato entro 5 minuti (revalidate 300s)
```

### Bug noto — workaround definitivo
n8n 2.9.4 non scrive nel body di Notion (errore 400 su HTTP Request e Append Block nativo).
Soluzione stabile: n8n manda il `page_id` via Telegram, Omar scrive `WRITE_ARTICLE: {page_id}`
in qualsiasi chat Claude.ai del progetto.

## Development Workflow
1. Make changes locally in Claude Code
2. Preview: `npm run dev` (localhost:3000)
3. Commit: `git add . && git commit -m "Description"`
4. Push: `git push`
5. Auto-deploy on Vercel (2-3 min)
6. Per aggiornamento immediato blog: redeploy manuale da Vercel dashboard

## Key Decisions Made
- Public repository (build in public, show code)
- Free-tier only tools (demonstrate €0 budget approach)
- Next.js over WordPress (modern, scalable, AI-friendly)
- Vercel over Siteground (optimized for Next.js)
- Personal storytelling tone (not generic corporate)
- Notion as CMS for blog (zero extra infrastructure, already in pipeline)
- n8n genera articoli automaticamente dal contenuto LinkedIn
- WRITE_ARTICLE via Claude.ai MCP come workaround stabile al bug n8n

## Content Strategy
Projects to showcase:
- Phoenix RE Capital (US real estate fund)
- Fastlien (tax lien software)
- FastLand (rapid prototyping demo — built in 1 day)
- Herbalife Multi-Country Ecommerce (6 countries)
- DocBit & Jera (IT solutions, RAG framework)
- Azoa Seed (AI-native startup factory)
- Wahooapp.io (WhatsApp business)

Blog categories: Tools AI, Business & Imprenditoria, Mindset & Produttività, Automazione, n8n, Produttività

Guides pipeline:
1. "Come ho costruito questo sito con Claude Code" (meta-guide) — priorità alta
2. "Sistema Notion + AI per knowledge management"
3. "Da audio WhatsApp a riassunto in 5 minuti" (NotebookLM)
4. "Google Ads automation: il mio stack"
5. "Land investment research con AI"

## Future Features
- Guida gratuita scaricabile — "Come ho costruito questo sito con Claude Code" con email gate + PDF
- Redesign globale: light mode default, dark mode toggle, amber accents, display font, scroll animations
- Analytics (Plausible free tier o Vercel Analytics)
- Notion auto-sync webhook (on-demand revalidation)
- Test Signals Roundup — 2 email con tag Gmail → webhook roundup
- Aggiornare Weekly Planner n8n con status IDEA (invece di Draft)
- Course platform integration
- Ecommerce demos

## Common Commands
```bash
# Development
npm run dev              # Start local server
npm run build           # Build for production
npm run lint            # Check code quality

# Git
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub (triggers deploy)

# Useful
git log --oneline -10   # See recent commits
```

## Troubleshooting
- Deploy not updating? Check Vercel is connected to correct repo
- Images not loading? Check files are in /public/post-images/ (cover blog) or /public/images/ (sito)
- Build failing? Check npm run build locally first
- Style not applying? Clear .next folder and rebuild
- Notion API 401? Check NOTION_API_KEY in Vercel env variables
- Blog posts not showing? Check Status = "Blog Published" in Notion DB

## Comando WRITE_ARTICLE

Quando ricevo il messaggio `WRITE_ARTICLE: {page_id}`:

1. Leggo la pagina Notion con quell'ID via MCP (`notion-fetch`)
2. Estraggo: Title, LinkedIn Post (fallback su LinkedIn Post Formatted se vuoto), Raw Notes
3. Genero articolo blog Markdown 800-1200 parole — stile Omar:
   - Conversazionale e diretto, mai accademico
   - Paragrafi brevi, niente blocchi di testo
   - Zero hype, zero buzzword
   - Struttura: apertura narrativa → problema/sfida → processo/soluzione → takeaway → chiusura con domanda
   - `##` per H2, `###` per H3, niente H1, niente emoji, Markdown puro
4. Scrivo il body nella pagina Notion via `notion-update-page` con `command: replace_content`
5. Costruisco lo slug dal titolo con la stessa funzione usata da Next.js per generare gli slug
   delle pagine blog, e scrivo la Blog URL nel campo Notion:
   `https://www.omarbortolato.it/blog/{slug}`
6. Confermo con link Notion e Blog URL generata

Non serve contesto aggiuntivo — il page_id è sufficiente.

### Logica slug (identica a `generateSlug` in lib/notion.ts)
```
title.toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")   // rimuove diacritici
     .replace(/[^a-z0-9\s-]/g, "")      // rimuove tutto il resto (apostrofi inclusi)
     .trim()
     .replace(/\s+/g, "-")
```
Esempio: `"un'idea"` → `"unidea"` (apostrofo rimosso, non trattino)

## Riferimenti esterni
- Content Inbox Notion: `2cfef582-d259-806b-a7a6-efc8bff25a68`
- Signals Inbox Notion: `2d8ef582-d259-801d-9eda-d1d7be952c48`
- Weekly Planner Notion: `2d9ef582-d259-8080-bb9a-ecee59587a39`
- n8n: https://wf.n8n.herbago.it

## Contact & Context
Owner: Omar Bortolato
Location: Padova, Italy
Background: AI Manager @ Aspiag ICS, Entrepreneur, Speaker AI Week Milano 2026
Mission: Make AI accessible and practical for everyone
