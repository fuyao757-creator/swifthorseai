import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "./i18n";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.swifthorseai.com";
export const SITE_BRAND = "Swift Horse";
export const SITE_DOMAIN = "swifthorseai.com";
export const SITE_OG_IMAGE = "/logos/swift-horse.png";
/** External profiles for Organization schema (GEO / knowledge graph). */
export const SITE_SAME_AS = [
  "https://github.com/fuyao757-creator/swifthorseai",
] as const;

export function getSiteTitle(locale: Locale): string {
  return locale === "zh-CN"
    ? `${SITE_BRAND} — 中国大模型 / China LLM 导航 · ${SITE_DOMAIN}`
    : `${SITE_BRAND} — China LLM & Chinese LLMs Index · ${SITE_DOMAIN}`;
}

export function getSiteDescription(locale: Locale): string {
  return locale === "zh-CN"
    ? `${SITE_BRAND}（${SITE_DOMAIN}）是面向全球团队的中国大模型（China LLM）开放索引：对比 DeepSeek、Qwen、GLM、Kimi，含模型库、场景匹配与选型指南，独立整理公开规格。`
    : `${SITE_BRAND} (${SITE_DOMAIN}): independent China LLM & Chinese LLMs index—compare DeepSeek, Qwen, GLM, Kimi; browse top Chinese AI models and selection guides for global teams.`;
}

export function getAlternateLanguages(path: string) {
  return locales.map((locale) => ({
    locale,
    url: `${BASE_URL}/${locale}${path}`,
  }));
}

export function buildHreflangTags(path: string) {
  const alternates = getAlternateLanguages(path);
  return alternates.map(({ locale, url }) => ({
    hrefLang: locale === "zh-CN" ? "zh-Hans" : locale,
    href: url,
  }));
}

export function buildAlternateLanguagesRecord(path: string): Record<string, string> {
  const tags = buildHreflangTags(path);
  const record = Object.fromEntries(tags.map((t) => [t.hrefLang, t.href]));
  record["x-default"] = getCanonicalUrl(defaultLocale, path);
  return record;
}

export function getCanonicalUrl(locale: Locale, path: string) {
  return `${BASE_URL}/${locale}${path}`;
}

export function getOpenGraphLocale(locale: Locale): string {
  return locale === "zh-CN" ? "zh_CN" : "en_US";
}

export function getHtmlLang(locale: Locale): string {
  return locale === "zh-CN" ? "zh-Hans" : locale;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  openGraphType = "website",
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  openGraphType?: "website" | "article";
}): Metadata {
  const canonical = getCanonicalUrl(locale, path);
  const ogImage = `${BASE_URL}${SITE_OG_IMAGE}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: buildAlternateLanguagesRecord(path),
    },
    openGraph: {
      type: openGraphType,
      locale: getOpenGraphLocale(locale),
      alternateLocale: locale === "zh-CN" ? ["en_US"] : ["zh_CN"],
      url: canonical,
      title,
      description,
      siteName: getSiteTitle(locale),
      images: [
        {
          url: ogImage,
          width: 512,
          height: 512,
          alt: SITE_BRAND,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
