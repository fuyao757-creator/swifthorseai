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

/** Stable dates so every deploy does not mark the whole sitemap as changed. */
const HOME_UPDATED = new Date("2026-09-29");
const CATALOG_UPDATED = new Date("2026-09-05");

function modelLastModified(id: string): Date {
  if (id === "glm-4-7" || id === "glm-4v" || id === "glm-5") return HOME_UPDATED;
  return CATALOG_UPDATED;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const models = getModels();
  const articles = getArticles();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: path === "" ? HOME_UPDATED : CATALOG_UPDATED,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const model of models) {
      entries.push({
        url: `${BASE_URL}/${locale}/models/${model.id}`,
        lastModified: modelLastModified(model.id),
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
