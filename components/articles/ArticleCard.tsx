import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import {
  formatArticleDate,
  localizeArticle,
  type Article,
} from "@/lib/articles";

export function ArticleCard({
  article,
  locale,
  dict,
}: {
  article: Article;
  locale: Locale;
  dict: Dictionary;
}) {
  const a = localizeArticle(article, locale);
  const tagLabels = dict.articles.tagLabels;

  return (
    <article className="article-card">
      <div className="article-card-meta">
        <time dateTime={article.publishedAt} className="article-card-date">
          {formatArticleDate(article.publishedAt, locale)}
        </time>
        {article.tags.length > 0 && (
          <div className="article-card-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="article-tag">
                {tagLabels[tag as keyof typeof tagLabels] ?? tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <h2 className="article-card-title">
        <Link href={`/${locale}/articles/${article.slug}`}>{a.title}</Link>
      </h2>
      <p className="article-card-excerpt">{a.excerpt}</p>
      <Link
        href={`/${locale}/articles/${article.slug}`}
        className="article-card-link"
      >
        {dict.articles.readMore} →
      </Link>
    </article>
  );
}
