# BeyondMax AI

AI model aggregation website showcasing China's leading large language models for international audiences.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Recharts** (benchmark radar chart)

## Features

- Bilingual support: English (default) + Simplified Chinese
- Auto locale detection via middleware (Accept-Language + cookie)
- URL structure: `/en/...` and `/zh-CN/...`
- Dark mode toggle
- SEO: hreflang tags, sitemap.xml, robots.txt
- JSON-based data (no database)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — middleware redirects to `/en` or `/zh-CN`.

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable (optional):
   - `NEXT_PUBLIC_BASE_URL` — your production domain (e.g. `https://beyondmax.ai`)

## Project Structure

```
├── app/[locale]/          # Localized pages
├── components/            # UI components
├── data/                  # models.json, benchmarks.json, news.json
├── messages/              # i18n UI strings
├── lib/                   # Utilities (i18n, data, SEO)
├── middleware.ts          # Locale detection & redirect
└── public/logos/          # Model logos
```

## Pages

| Path | Description |
|------|-------------|
| `/[locale]` | Model list with company filter |
| `/[locale]/models/[id]` | Model detail |
| `/[locale]/benchmarks` | Radar chart + sortable table |
| `/[locale]/recommend` | Scenario-based recommendations |
| `/[locale]/news` | News timeline |

## Adding Models

Edit `data/models.json`, `data/benchmarks.json`, and optionally `data/news.json`.
