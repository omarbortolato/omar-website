# Omar Bortolato — Personal Website

Personal professional website built with Next.js 14, Tailwind CSS, and TypeScript.

## Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) | Framework (App Router) |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) | UI components |
| [Lucide React](https://lucide.dev) | Icons |
| [Vercel](https://vercel.com) | Deployment |

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── page.tsx            # Homepage
│   ├── about/page.tsx      # About page
│   ├── progetti/page.tsx   # Projects page
│   ├── blog/page.tsx       # Blog listing
│   └── collabora/page.tsx  # Contact page
├── components/
│   ├── ui/                 # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── card.tsx
│   └── layout/             # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   └── utils.ts            # cn() utility
├── tailwind.config.ts      # Tailwind config with custom colors
├── components.json         # shadcn/ui config
└── next.config.mjs
```

## Color Palette

| Name | Value | Usage |
|---|---|---|
| Primary | `#1E3A8A` | Navy blue — brand, buttons, links |
| Accent | `#F59E0B` | Amber orange — highlights, CTAs |
| Grays | Tailwind defaults | Text, borders, backgrounds |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

The project is Vercel-ready. Connect your GitHub repo to Vercel and deploy with zero configuration.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add <component-name>
```

## Routes

| Route | Page |
|---|---|
| `/` | Homepage |
| `/about` | About me |
| `/progetti` | Projects |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post |
| `/collabora` | Contact / Collaborate |
