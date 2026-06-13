import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getModels } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { LandingPage } from "@/components/LandingPage";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { HeroVideoPreload } from "@/components/HeroVideoPreload";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "",
    title: `${dict.siteName} - ${dict.landing.metaTitle}`,
    description: dict.landing.metaDescription,
  });
}

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const models = getModels();
  const providers = new Set(models.map((m) => m.company)).size;

  return (
    <>
      <SiteJsonLd locale={locale} />
      <HeroVideoPreload />
      <LandingPage
        locale={locale}
        dict={dict}
        stats={{ models: models.length, providers }}
      />
    </>
  );
}
