import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getArticles } from "@/lib/articles";
import { buildPageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/articles/ArticleCard";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.articles;
  return buildPageMetadata({
    locale,
    path: "/articles",
    title: `${t.pageTitle} - ${dict.siteName}`,
    description: t.pageSubtitle,
  });
}

export default function ArticlesPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.articles;
  const articles = getArticles();

  return (
    <div className="articles-page animate-fade-in">
      <PageHeader
        title={t.pageTitle}
        subtitle={t.pageSubtitle}
        backHref={`/${locale}`}
        backLabel={dict.nav.backHome}
      />

      {articles.length === 0 ? (
        <div className="article-empty">
          <p>{t.empty}</p>
        </div>
      ) : (
        <div className="article-list">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              locale={locale}
              dict={dict}
            />
          ))}
        </div>
      )}
    </div>
  );
}
