import type { Locale } from "@/lib/i18n";
import { localizeModel, type Model } from "@/lib/data";
import { BASE_URL, SITE_BRAND } from "@/lib/seo";

export function ModelJsonLd({
  model,
  locale,
}: {
  model: Model;
  locale: Locale;
}) {
  const m = localizeModel(model, locale);
  const url = `${BASE_URL}/${locale}/models/${model.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: m.name,
    description: m.tagline,
    url,
    applicationCategory: "ArtificialIntelligenceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/OnlineOnly",
    },
    provider: {
      "@type": "Organization",
      name: m.companyName,
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_BRAND,
      url: BASE_URL,
    },
    inLanguage: locale === "zh-CN" ? "zh-Hans" : "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
