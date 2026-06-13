import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getModels } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { HomeClient } from "@/components/HomeClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/models",
    title: `${dict.nav.models} - ${dict.siteName}`,
    description: dict.tagline,
  });
}

export default function ModelsPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const models = getModels();

  return <HomeClient models={models} locale={locale} dict={dict} />;
}
