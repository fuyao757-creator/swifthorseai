import type { Metadata } from "next";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/disclaimer",
    title: `${dict.legal.pageTitle} - ${dict.siteName}`,
    description: dict.legal.pageSubtitle,
  });
}

function LegalSection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="card-static p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
        {body}
      </p>
    </section>
  );
}

export default function DisclaimerPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) return null;
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const { legal } = dict;

  const sections = [
    { title: legal.nonOfficialTitle, body: legal.nonOfficialBody },
    { title: legal.contentTitle, body: legal.contentBody },
    { title: legal.noAdviceTitle, body: legal.noAdviceBody },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={legal.pageTitle}
        subtitle={legal.pageSubtitle}
        backHref={`/${locale}`}
        backLabel={dict.nav.backHome}
      />
      <div className="space-y-6">
        {sections.map((s) => (
          <LegalSection key={s.title} title={s.title} body={s.body} />
        ))}
      </div>
    </div>
  );
}
