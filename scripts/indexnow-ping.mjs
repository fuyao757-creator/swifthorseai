/**
 * Post-build IndexNow ping (Bing, Yandex, etc.).
 * Runs only on Vercel production unless FORCE_INDEXNOW=1.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.swifthorseai.com";
const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? "6f8e4a2b9c1d3e5f7a8b9c0d1e2f3a4";
const HOST = "www.swifthorseai.com";
const LOCALES = ["en", "zh-CN"];
const STATIC_PATHS = [
  "",
  "/models",
  "/services",
  "/match",
  "/prompts",
  "/articles",
  "/about",
  "/disclaimer",
];

const PRIORITY_URLS = [
  `${BASE_URL}/en`,
  `${BASE_URL}/en/articles/china-ai-llm-guide-2026`,
  `${BASE_URL}/en/articles/access-china-llm-api-overseas`,
];

function collectUrls() {
  const articlesPath = join(ROOT, "data", "articles.json");
  const { articles } = JSON.parse(readFileSync(articlesPath, "utf8"));
  const urls = new Set(PRIORITY_URLS);

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      urls.add(`${BASE_URL}/${locale}${path}`);
    }
    for (const article of articles) {
      urls.add(`${BASE_URL}/${locale}/articles/${article.slug}`);
    }
  }

  return [...PRIORITY_URLS, ...Array.from(urls).filter((u) => !PRIORITY_URLS.includes(u))];
}

async function pingIndexNow() {
  if (
    process.env.VERCEL_ENV &&
    process.env.VERCEL_ENV !== "production" &&
    process.env.FORCE_INDEXNOW !== "1"
  ) {
    console.log("[indexnow] Skipped (not production). Set FORCE_INDEXNOW=1 to override.");
    return;
  }

  const urlList = collectUrls();
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      console.log(
        `[indexnow] ${endpoint} → ${res.status} (${urlList.length} URLs)`
      );
    } catch (err) {
      console.warn(`[indexnow] ${endpoint} failed:`, err.message);
    }
  }
}

pingIndexNow().catch((err) => {
  console.warn("[indexnow] Unexpected error:", err);
  process.exit(0);
});
