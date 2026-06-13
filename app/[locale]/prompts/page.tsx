import { Suspense } from "react";
import type { Metadata } from "next";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { PromptToolClient } from "@/components/prompt-tool/PromptToolClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/prompts",
    title: `${dict.promptTool.pageTitle} - ${dict.siteName}`,
    description: dict.promptTool.pageSubtitle,
  });
}

export default function PromptsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) return null;
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <Suspense fallback={null}>
      <PromptToolClient locale={locale} dict={dict} />
    </Suspense>
  );
}
