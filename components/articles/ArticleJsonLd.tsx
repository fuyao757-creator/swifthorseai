import type { Article } from "@/lib/articles";
import { localizeArticle } from "@/lib/articles";
import type { Locale } from "@/lib/i18n";
import { BASE_URL, SITE_BRAND, SITE_OG_IMAGE, SITE_SAME_AS } from "@/lib/seo";

export function ArticleJsonLd({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  const localized = localizeArticle(article, locale);
  const url = `${BASE_URL}/${locale}/articles/${article.slug}`;

  const articleNode = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: localized.title,
    description: localized.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: locale === "zh-CN" ? "zh-Hans" : "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    author: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: BASE_URL,
      sameAs: [...SITE_SAME_AS],
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}${SITE_OG_IMAGE}`,
      },
    },
  };

  const graph: Record<string, unknown>[] = [articleNode];

  if (article.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: localized.faqs!.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
