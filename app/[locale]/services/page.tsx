import { Suspense } from "react";
import type { Metadata } from "next";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { CommercialIndexClient } from "@/components/commercial-index/CommercialIndexClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/services",
    title: `${dict.commercialIndex.pageTitle} - ${dict.siteName}`,
    description: dict.commercialIndex.pageSubtitle,
  });
}

export default function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) return null;
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <Suspense fallback={null}>
      <CommercialIndexClient locale={locale} dict={dict} />
    </Suspense>
  );
}
