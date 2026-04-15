# Stato Progetto — omarbortolato.it
Aggiornato: 15 aprile 2026. Stato definitivo dopo completamento test E2E pipeline content.

## Stato LIVE ✅

### Pagine attive
- Homepage ✅
- About ✅
- Progetti ✅
- Blog (Notion CMS, filtro Blog Published) ✅
- Collabora (Cal.com attivo) ✅

### Funzionalità attive
- Cover image articoli: nome file locale (`/post-images/`) e URL esterno ✅
- Campo Blog URL compilato automaticamente da WRITE_ARTICLE ✅
- Pipeline content E2E testata dall'idea alla pubblicazione ✅

## Stack
- Next.js 14, Tailwind CSS, TypeScript
- Vercel — dominio custom https://www.omarbortolato.it
- GitHub — https://github.com/omarbortolato/omar-website
- Notion CMS — Content Inbox `2cfef582-d259-806b-a7a6-efc8bff25a68`
- n8n self-hosted 2.9.4 — https://wf.n8n.herbago.it

## Flusso Content Pipeline

```
Telegram voce/testo → Content Inbox (IDEA)
Gmail con tag       → Signals Inbox

  ↓ Lunedì ore 7 — Weekly Editorial Planner (n8n)
  GPT-4.1 propone 3 idee → Telegram bottoni 1/2/3

  ↓ Omar sceglie + Raw Notes → "Ready to Generate"

  Trigger 1 (webhook n8n)
  → OpenAI: LinkedIn post, hashtag, image prompt, meta, tags
  → Notifica Telegram con link pagina

  ↓ Omar pubblica su LinkedIn → "LinkedIn Published"

  Trigger 2 (webhook n8n)
  → Claude Sonnet genera Markdown
  → Telegram: "WRITE_ARTICLE: {page_id}"

  ↓ Omar scrive WRITE_ARTICLE in Claude.ai

  Claude: legge pagina, scrive body, compila Blog URL

  ↓ Omar revisiona → "Blog Published"

  Sito aggiornato entro 5 minuti (revalidate 300s)
```

### Status workflow Content Inbox
`IDEA → Ready to Generate → LinkedIn Published → Blog Published → ⚠️ Need Review`

### Bug noto — workaround definitivo
n8n 2.9.4 non scrive nel body Notion (errore 400). Workaround stabile: n8n manda il `page_id`
via Telegram, Omar esegue `WRITE_ARTICLE: {page_id}` in qualsiasi chat Claude.ai del progetto.

## Schema Notion Content Inbox (campi completi)

| Campo                  | Tipo         | Uso                                              |
|------------------------|--------------|--------------------------------------------------|
| Title                  | title        | Titolo articolo                                  |
| Status                 | select       | IDEA → Ready to Generate → LinkedIn Published → Blog Published → ⚠️ Need Review |
| Source                 | select       | Planner / Telegram Voice / Telegram Text / Manual |
| Raw notes              | rich_text    | Input originale                                  |
| LinkedIn Post          | rich_text    | Versione archivio                                |
| LinkedIn Post Formatted| rich_text    | Pronto da incollare (con hashtag)                |
| Image Description      | rich_text    | Prompt per Midjourney/Ideogram                   |
| Cover Image URL        | url          | Nome file (es. `foto.jpg`) o URL esterno         |
| Blog Abstract          | rich_text    | Excerpt card sito (max 250 char)                 |
| Meta Title             | rich_text    | SEO (max 60 char)                                |
| Meta Description       | rich_text    | SEO (max 155 char)                               |
| Tags                   | multi_select | AI, Automazione, Business, Imprenditoria, n8n, Produttività, Tools AI, Mindset |
| Published Date         | date         | Impostata da n8n                                 |
| Blog URL               | url          | Compilata automaticamente da WRITE_ARTICLE       |
| Planner URL            | url          | Tracciabilità sorgente                           |

## Workflow n8n attivi

| Nome                        | Trigger           | Funzione                          |
|-----------------------------|-------------------|-----------------------------------|
| Telegram → Content Inbox    | Messaggio Telegram| Salva idee voce/testo             |
| Weekly Editorial Planner    | Lunedì 7:00       | 3 idee editoriali + Telegram      |
| Gmail → Signals Inbox       | Gmail tag         | Salva segnali newsletter          |
| Trigger 1 — Ready to Generate | Webhook Notion  | OpenAI STEP 1                     |
| Trigger 2 — LinkedIn Published | Webhook Notion | Claude STEP 2 + Telegram          |
| Signals Roundup             | Webhook manuale   | Post ultime notizie AI            |

### Signals Roundup
Per post "ultime notizie AI":
1. Spunta `Include in Roundup` sui segnali nel Signals Inbox
2. POST su `https://wf.n8n.herbago.it/webhook/signals-roundup`
3. GPT genera post roundup → nuovo record Content Inbox
4. Flusso normale da LinkedIn Published in poi

## Prossimi step
1. **Guida gratuita scaricabile** — "Come ho costruito questo sito con Claude Code" — banner homepage, email gate, download PDF
2. **Redesign globale** — light mode default, dark mode toggle, amber accents, display font per headings, scroll animations sottili
3. **Test Signals Roundup** — 2 email con tag Gmail, selezionare Signals Inbox, lanciare webhook
4. **Aggiornare Weekly Planner n8n** — status IDEA invece di Draft

## Riferimenti
- Sito: https://www.omarbortolato.it
- Repo: https://github.com/omarbortolato/omar-website
- Content Inbox: `2cfef582-d259-806b-a7a6-efc8bff25a68`
- Signals Inbox: `2d8ef582-d259-801d-9eda-d1d7be952c48`
- Weekly Planner: `2d9ef582-d259-8080-bb9a-ecee59587a39`
- n8n: https://wf.n8n.herbago.it
- Handoff Notion: https://www.notion.so/330ef582d2598175b6b8d3eb066d8a4f
