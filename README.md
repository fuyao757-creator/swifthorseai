# Swift Horse

Independent index of China’s leading AI models for global teams.

**Live site:** [https://www.swifthorseai.com](https://www.swifthorseai.com)

Browse Chinese LLMs (DeepSeek, Qwen, Kimi, GLM and others), compare specs, match by scenario, and read selection guides. Public specs only—not vendor docs or buying advice.

- English (default): https://www.swifthorseai.com/en
- 中文: https://www.swifthorseai.com/zh-CN

## Guides that match common searches

| Intent | Guide |
|--------|--------|
| Best Chinese LLM | https://www.swifthorseai.com/en/articles/best-chinese-llm-2026 |
| GLM-4 / GLM-4.7 | https://www.swifthorseai.com/en/articles/glm-4-selection-guide-2026 |
| China LLM API from overseas | https://www.swifthorseai.com/en/articles/access-china-llm-api-overseas |
| Rankings / use-case matrix | https://www.swifthorseai.com/en/articles/top-chinese-ai-models-2026 |

## Tech stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS

## Features

- Bilingual URLs: `/en/...` and `/zh-CN/...`
- Locale detection via middleware
- Model catalog, comparison, scenario matching, prompt tools
- SEO: canonical, hreflang, sitemap.xml, robots.txt, JSON-LD, llms.txt

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — middleware redirects to `/en` or `/zh-CN`.

## Deploy

Vercel production domain: `https://www.swifthorseai.com`

Optional env:

- `NEXT_PUBLIC_BASE_URL` — `https://www.swifthorseai.com`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement ID

## Project structure

```
├── app/[locale]/          # Localized pages
├── components/            # UI
├── data/                  # models.json, articles.json
├── messages/              # i18n strings
├── lib/                   # i18n, data, SEO
├── middleware.ts          # Locale redirect
└── public/logos/          # Brand and model logos
```
