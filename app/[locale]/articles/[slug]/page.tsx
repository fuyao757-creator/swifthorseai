import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, isValidLocale, locales } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import {
  formatArticleDate,
  getArticleBySlug,
  getArticleSlugs,
  localizeArticle,
} from "@/lib/articles";
import { buildPageMetadata } from "@/lib/seo";
import { BackLink } from "@/components/BackLink";
import { ArticleDetail } from "@/components/articles/ArticleDetail";
import { ArticleJsonLd } from "@/components/articles/ArticleJsonLd";
import { LegalNotice } from "@/components/LegalNotice";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getArticleSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Not Found" };
  const dict = getDictionary(locale);
  const localized = localizeArticle(article, locale);
  const path = `/articles/${params.slug}`;

  return buildPageMetadata({
    locale,
    path,
    title: `${localized.title} - ${dict.siteName}`,
    description: localized.excerpt,
    openGraphType: "article",
  });
}

export default function ArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.articles;
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const localized = localizeArticle(article, locale);
  const tagLabels = t.tagLabels;

  return (
    <>
      <ArticleJsonLd article={article} locale={locale} />

      <article className="articles-page animate-fade-in">
        <BackLink href={`/${locale}/articles`} label={t.backToList} />

        <header className="article-masthead glass-hero relative overflow-hidden">
          <span className="tech-corners opacity-40" aria-hidden />
          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-wrap items-center gap-3">
              <time
                dateTime={article.publishedAt}
                className="mono-label"
              >
                {formatArticleDate(article.publishedAt, locale)}
              </time>
            </div>
            <h1 className="display-hero mt-6 max-w-3xl text-3xl sm:text-4xl">
              {localized.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {localized.excerpt}
            </p>
            {article.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="article-tag">
                    {tagLabels[tag as keyof typeof tagLabels] ?? tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <ArticleDetail article={localized} locale={locale} dict={dict} />

        <div className="mt-10">
          <LegalNotice linkHref={`/${locale}/disclaimer`} linkLabel={dict.footer.readMore}>
            {t.disclaimer}
          </LegalNotice>
        </div>

        <p className="mt-6">
          <Link href={`/${locale}/articles`} className="btn-ghost text-sm">
            ← {t.backToList}
          </Link>
        </p>
      </article>
    </>
  );
}
