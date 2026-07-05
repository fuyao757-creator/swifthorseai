import { Suspense } from "react";
import type { Metadata } from "next";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { ModelMatchChatClient } from "@/components/match-reference/ModelMatchChatClient";
import { GuideLinksStrip } from "@/components/GuideLinksStrip";
import { MATCH_PAGE_GUIDE_SLUGS } from "@/lib/featured-guides";

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
      <div className="animate-fade-in">
        <ModelMatchChatClient locale={locale} dict={dict} />
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <GuideLinksStrip
            locale={locale}
            dict={dict}
            slugs={MATCH_PAGE_GUIDE_SLUGS}
            compact
          />
        </div>
      </div>
    </Suspense>
  );
}
