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

## Tech Stack (All FREE)
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- Language: TypeScript
- Hosting: Vercel (auto-deploy)
- Version Control: GitHub (public repo)
- Development: Claude Code + Claude.ai Projects
- Icons: Lucide React
- Font: Inter (Google Fonts)

## Repository Info
- GitHub: https://github.com/omarbortolato/omar-website
- Live Site: https://omarbortolato-site.vercel.app
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
├─ blog/page.tsx           # Blog listing ⏳ (Notion CMS)
├─ blog/[slug]/page.tsx    # Blog article ⏳ (Notion CMS)
└─ collabora/page.tsx      # Contact/collaboration 📋 (TODO)
components/
├─ layout/
│  ├─ Header.tsx           # Navigation
│  └─ Footer.tsx           # Social links
└─ ui/                     # shadcn components
lib/
└─ notion.ts               # Notion API utility ⏳ (TODO)
public/
└─ images/
   ├─ omar-hero.png
   ├─ omar-profile.jpg
   ├─ omar-speaking.jpg / omar-speaking2.jpg / omar-speaking3.jpg
   ├─ omar-private-nobg.PNG
   ├─ omar-figlio.JPEG
   ├─ herbalife-screenshot.png
   ├─ phoenixre-screenshot.png
   ├─ fastlien-screenshot.png
   ├─ fastland-screenshot.png
   ├─ docbit-screenshot.png
   └─ wahooapp-screenshot.png
```

## Current Status
- Infrastructure setup complete ✅
- Homepage live with real content ✅
- About page live ✅
- Progetti page live ✅
- Git + Vercel workflow functional ✅
- Blog (in development — Notion CMS) ⏳
- Collabora page (planned) 📋
- Redesign globale (after all pages have content) 🔮

## Notion CMS (Blog)

The blog uses Notion as CMS. n8n automatically generates articles in the
"Blog Expanded" field of the Content Inbox database. The site reads directly
from Notion API — no separate DB, no MDX files, no extra infrastructure.

### Database
- ID: 2cfef582-d259-806b-a7a6-efc8bff25a68
- Env variable: NOTION_API_KEY (configured on Vercel)
- Filter: Status = "Published" only
- Sort: Published Date descending

### Fields used
| Field            | Type         | Usage                     |
|------------------|--------------|---------------------------|
| Title            | title        | Article title             |
| Blog Abstract    | rich_text    | Excerpt / card preview    |
| Blog Expanded    | rich_text    | Article body (HTML)       |
| Meta Title       | rich_text    | SEO <title>               |
| Meta Description | rich_text    | SEO <meta description>    |
| Tags             | multi_select | Category badges           |
| Published Date   | date         | Publication date          |
| Status           | select       | Filter "Published" only   |

### lib/notion.ts interface
```typescript
interface BlogPost {
  id: string
  title: string
  slug: string        // generated from Title at runtime
  abstract: string
  content: string     // HTML from Blog Expanded
  tags: string[]
  publishedDate: string
  metaTitle: string
  metaDescription: string
}

export async function getBlogPosts(): Promise<BlogPost[]>
export async function getBlogPost(slug: string): Promise<BlogPost | null>
export function generateSlug(title: string): string
```

### Important technical notes
- Blog Expanded is pure HTML (h2, h3, p, ul, li, strong, em, a) — NOT MDX
- Notion API requires header: "Notion-Version": "2022-06-28"
- Tags is multi_select → array of objects {name, color}
- Published Date may be null for drafts — handle gracefully
- Slug: generated from Title (lowercase, spaces→hyphens, no special chars)
- Caching: fetch with revalidate: 3600 (1 hour)
- Install: @tailwindcss/typography for prose styling

## Content Pipeline
```
Telegram/Gmail → n8n → GPT-4.1 → Notion Content Inbox
                                         ↓
                             Blog Expanded (HTML)
                             Blog Abstract
                             Meta Title/Description
                             Tags, Published Date
                                         ↓
                             Next.js reads via Notion API
                             (only when Status = "Published")
```

## Development Workflow
1. Make changes locally in Claude Code
2. Preview: npm run dev (localhost:3000)
3. Commit: git add . && git commit -m "Description"
4. Push: git push
5. Auto-deploy on Vercel (2-3 min)

## Key Decisions Made
- Public repository (build in public, show code)
- Free-tier only tools (demonstrate €0 budget approach)
- Next.js over WordPress (modern, scalable, AI-friendly)
- Vercel over Siteground (optimized for Next.js)
- Personal storytelling tone (not generic corporate)
- Image-heavy design (show don't tell)
- Notion as CMS for blog (zero extra infrastructure, already in pipeline)
- n8n generates blog articles automatically from LinkedIn content ideas

## Content Strategy
Projects to showcase:
- Phoenix RE Capital (US real estate fund)
- Fastlien (tax lien software)
- FastLand (rapid prototyping demo — built in 1 day)
- Herbalife Multi-Country Ecommerce (6 countries)
- DocBit & Jera (IT solutions, RAG framework)
- Azoa Seed (AI-native startup factory)
- Wahooapp.io (WhatsApp business)

Blog categories:
- Tools AI
- Business & Imprenditoria
- Mindset & Produttività

Guides pipeline:
1. "Come ho costruito questo sito con Claude Code" (meta-guide)
2. "Sistema Notion + AI per knowledge management"
3. "Da audio WhatsApp a riassunto in 5 minuti" (NotebookLM)
4. "Google Ads automation: il mio stack"
5. "Land investment research con AI"

## Meta Tags (to update in layout.tsx)
- og:title → "Omar Bortolato — AI Manager & Imprenditore"
- og:description → "AI pratica per chi vuole fare, non solo sapere."
- og:url → https://omarbortolato.it
- twitter:title/description → align with og

## Future Features
- Newsletter (when justified by content volume)
- Analytics (Plausible free tier or Vercel Analytics)
- Cal.com integration (booking — Collabora page)
- Redesign globale: dark mode toggle, new typography, micro-animations
- Notion auto-sync webhook (on-demand revalidation)
- Telegram → n8n → Claude API automation (long-term)
- Course platform integration
- Ecommerce demos
- Startup showcases

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
- Images not loading? Check files are in /public/images/
- Build failing? Check npm run build locally first
- Style not applying? Clear .next folder and rebuild
- Notion API 401? Check NOTION_API_KEY in Vercel env variables
- Blog posts not showing? Check Status = "Blog Published" in Notion DB

## Comando WRITE_ARTICLE

Quando ricevo il messaggio `WRITE_ARTICLE: {page_id}`:

1. Leggo la pagina Notion con quell'ID via MCP (`notion-fetch`)
2. Estraggo: Title, LinkedIn Post (fallback su LinkedIn Post Formatted), Raw Notes
3. Genero un articolo blog in Markdown (800-1200 parole) — stile Omar:
   - Conversazionale e diretto, mai accademico
   - Paragrafi brevi, niente blocchi di testo
   - Zero hype, zero buzzword
   - Struttura: apertura narrativa → problema/sfida → processo/soluzione → takeaway → chiusura con domanda
   - `##` per H2, `###` per H3, niente H1, niente emoji, Markdown puro
4. Scrivo il body nella pagina Notion via `notion-update-page` con `command: replace_content`
5. Costruisco la Blog URL dallo slug del titolo con la stessa logica usata da Next.js
   e la scrivo nel campo Blog URL della pagina Notion via `notion-update-page` `update_properties`
6. Confermo con il link alla pagina Notion e la Blog URL generata

Non serve contesto aggiuntivo — il page_id è sufficiente.

### Logica slug (deve restare identica a `generateSlug` in lib/notion.ts)
```
title.toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")   // rimuove diacritici
     .replace(/[^a-z0-9\s-]/g, "")      // rimuove tutto il resto (apostrofi inclusi)
     .trim()
     .replace(/\s+/g, "-")
```
Esempio: `"un'idea"` → `"unidea"` (apostrofo rimosso, non sostituito con trattino)

## Contact & Context
Owner: Omar Bortolato
Location: Padova, Italy
Background: AI Manager @ Aspiag ICS, Entrepreneur, Speaker AI Week Milano 2026
Mission: Make AI accessible and practical for everyone
