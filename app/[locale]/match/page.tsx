import { Suspense } from "react";
import type { Metadata } from "next";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { ModelMatchChatClient } from "@/components/match-reference/ModelMatchChatClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/match",
    title: `${dict.modelMatchChat.pageTitle} - ${dict.siteName}`,
    description: dict.modelMatchChat.pageSubtitle,
  });
}

export default function MatchPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) return null;
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <Suspense fallback={null}>
      <ModelMatchChatClient locale={locale} dict={dict} />
    </Suspense>
  );
}
