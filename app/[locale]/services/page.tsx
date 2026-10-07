import type { Metadata } from "next";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { resolveCompareIds } from "@/lib/model-workflow";
import { CommercialIndexView } from "@/components/commercial-index/CommercialIndexView";

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
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { models?: string | string[] };
}) {
  if (!isValidLocale(params.locale)) return null;
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const selectedIds = resolveCompareIds(searchParams?.models);

  return (
    <CommercialIndexView
      locale={locale}
      dict={dict}
      selectedIds={selectedIds}
    />
  );
}
