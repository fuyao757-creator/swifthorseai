import { BASE_URL, SITE_BRAND, SITE_DOMAIN, getSiteDescription, SITE_SAME_AS } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export function SiteJsonLd({ locale }: { locale: Locale }) {
  const description = getSiteDescription(locale);
  const dict = getDictionary(locale);
  const pageName = `${dict.landing.metaTitle} | ${dict.siteName}`;
  const url = `${BASE_URL}/${locale}`;
  const picks = dict.landing.heroQueryLinks;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: SITE_BRAND,
        url: BASE_URL,
        description,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logos/swift-horse.png`,
        },
        sameAs: [...SITE_SAME_AS],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: `${SITE_BRAND} — ${SITE_DOMAIN}`,
        url: BASE_URL,
        description,
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: ["en", "zh-Hans"],
      },
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: pageName,
        description: dict.landing.metaDescription,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        inLanguage: locale === "zh-CN" ? "zh-Hans" : "en",
      },
      {
        "@type": "ItemList",
        "@id": `${url}/#shortlist`,
        name: dict.landing.metaTitle,
        itemListElement: picks.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${item.label}: ${item.pick}`,
          description: item.detail,
          url: `${BASE_URL}/${locale}${item.href}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        mainEntity: picks.map((item) => ({
          "@type": "Question",
          name: item.label,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${item.pick}. ${item.detail}`,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
