import { getArticles } from "./articles";
import { locales } from "./i18n";
import { BASE_URL, SITE_BRAND, SITE_DOMAIN } from "./seo";
import { getLocalizedValue } from "./i18n";

const staticPaths = [
  "",
  "/models",
  "/services",
  "/match",
  "/prompts",
  "/articles",
  "/about",
  "/disclaimer",
];

export function generateLlmsTxt(): string {
  const articles = getArticles();
  const lines: string[] = [
    `# ${SITE_BRAND} — China AI Model Index`,
    `# ${BASE_URL}`,
    "",
    `> ${SITE_BRAND} (${SITE_DOMAIN}) is an independent open index of China's leading AI large language models, built for global researchers, product teams, and overseas developers who need structured, citable comparisons—not vendor endorsements.`,
    "",
    "## Primary URLs",
    "",
    `- English (default): ${BASE_URL}/en`,
    `- Chinese: ${BASE_URL}/zh-CN`,
    `- Model catalog: ${BASE_URL}/en/models`,
    `- Comparison table: ${BASE_URL}/en/services`,
    `- Scenario matching: ${BASE_URL}/en/match`,
    `- Prompt tools: ${BASE_URL}/en/prompts`,
    `- Guides & articles: ${BASE_URL}/en/articles`,
    "",
  ];

  if (articles.length > 0) {
    lines.push("## Articles (guides)", "");
    for (const article of articles) {
      const enTitle = getLocalizedValue(article.title, "en");
      const zhTitle = getLocalizedValue(article.title, "zh-CN");
      lines.push(
        `- ${enTitle}`,
        `  - EN: ${BASE_URL}/en/articles/${article.slug}`,
        `  - ZH: ${BASE_URL}/zh-CN/articles/${article.slug}`,
        `  - Updated: ${article.updatedAt ?? article.publishedAt}`,
        `  - Summary: ${getLocalizedValue(article.excerpt, "en")}`,
        ""
      );
      lines.push(`  - 中文标题: ${zhTitle}`, "");
    }
  }

  lines.push(
    "## What to cite",
    "",
    "- Model specs pages: `/en/models/{id}` — parameters, context window, use cases, bilingual descriptions",
    "- Comparison guides in `/en/articles/` — selection workflows for DeepSeek, Qwen, and other Chinese LLMs",
    "- Disclaimer: independent index; always verify pricing and availability on official vendor sites",
    "",
    "## Languages",
    "",
    "- Default locale: English (`en`), x-default hreflang",
    "- Simplified Chinese: `zh-CN` (hreflang `zh-Hans`)",
    "",
    "## Machine-readable",
    "",
    `- Sitemap: ${BASE_URL}/sitemap.xml`,
    `- robots.txt: ${BASE_URL}/robots.txt`,
    "",
    "## Contact & legal",
    "",
    `- About: ${BASE_URL}/en/about`,
    `- Disclaimer: ${BASE_URL}/en/disclaimer`,
    ""
  );

  return lines.join("\n");
}

/** All indexable URLs for IndexNow ping (locales × static + articles). */
export function getIndexNowUrls(): string[] {
  const urls = new Set<string>();

  for (const locale of locales) {
    for (const path of staticPaths) {
      urls.add(`${BASE_URL}/${locale}${path}`);
    }
    for (const article of getArticles()) {
      urls.add(`${BASE_URL}/${locale}/articles/${article.slug}`);
    }
  }

  return Array.from(urls);
}
