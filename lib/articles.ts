import articlesData from "@/data/articles.json";
import type { Locale } from "./i18n";
import { getLocalizedValue } from "./i18n";
import type { LocalizedString } from "./data";

export type ArticleSection = {
  heading?: LocalizedString;
  paragraphs: LocalizedString[];
};

export type ArticleFaq = {
  question: LocalizedString;
  answer: LocalizedString;
};

export type Article = {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  relatedModelIds?: string[];
  title: LocalizedString;
  excerpt: LocalizedString;
  sections: ArticleSection[];
  faqs?: ArticleFaq[];
};

export function getArticles(): Article[] {
  return [...(articlesData.articles as Article[])].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleSlugs(): string[] {
  return getArticles().map((a) => a.slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function localizeArticle(article: Article, locale: Locale) {
  return {
    slug: article.slug,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    tags: article.tags,
    relatedModelIds: article.relatedModelIds,
    title: getLocalizedValue(article.title, locale),
    excerpt: getLocalizedValue(article.excerpt, locale),
    sections: article.sections.map((section) => ({
      heading: section.heading
        ? getLocalizedValue(section.heading, locale)
        : undefined,
      paragraphs: section.paragraphs.map((p) => getLocalizedValue(p, locale)),
    })),
    faqs: article.faqs?.map((faq) => ({
      question: getLocalizedValue(faq.question, locale),
      answer: getLocalizedValue(faq.answer, locale),
    })),
  };
}

export type LocalizedArticle = ReturnType<typeof localizeArticle>;

export function formatArticleDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
