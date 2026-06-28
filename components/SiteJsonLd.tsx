import { BASE_URL, SITE_BRAND, SITE_DOMAIN, getSiteDescription, SITE_SAME_AS } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

export function SiteJsonLd({ locale }: { locale: Locale }) {
  const description = getSiteDescription(locale);
  const url = `${BASE_URL}/${locale}`;

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
        name: `${SITE_BRAND} — ${SITE_DOMAIN}`,
        description,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        inLanguage: locale === "zh-CN" ? "zh-Hans" : "en",
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
