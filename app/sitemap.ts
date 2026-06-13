import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getModels } from "@/lib/data";
import { getArticles } from "@/lib/articles";
import { BASE_URL } from "@/lib/seo";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const models = getModels();
  const articles = getArticles();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const model of models) {
      entries.push({
        url: `${BASE_URL}/${locale}/models/${model.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }

    for (const article of articles) {
      entries.push({
        url: `${BASE_URL}/${locale}/articles/${article.slug}`,
        lastModified: new Date(article.updatedAt ?? article.publishedAt),
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  return entries;
}
