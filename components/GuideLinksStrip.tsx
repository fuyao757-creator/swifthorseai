import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { getArticleBySlug } from "@/lib/articles";
import { getLocalizedValue } from "@/lib/i18n";

export function GuideLinksStrip({
  locale,
  dict,
  slugs,
  compact = false,
}: {
  locale: Locale;
  dict: Dictionary;
  slugs: readonly string[];
  compact?: boolean;
}) {
  const g = {
    eyebrow: dict.landing.guideLinksEyebrow,
    title: dict.landing.guideLinksTitle,
    subtitle: dict.landing.guideLinksSubtitle,
    viewAll: dict.landing.guideLinksViewAll,
  };
  const items = slugs
    .map((slug) => {
      const article = getArticleBySlug(slug);
      if (!article) return null;
      return {
        slug,
        title: getLocalizedValue(article.title, locale),
        excerpt: getLocalizedValue(article.excerpt, locale),
      };
    })
    .filter(Boolean) as { slug: string; title: string; excerpt: string }[];

  if (items.length === 0) return null;

  return (
    <section
      className={compact ? "guide-links-strip guide-links-strip--compact" : "guide-links-strip mt-8 lg:mt-10"}
      aria-labelledby="guide-links-title"
    >
      <div className="guide-links-strip-header">
        <p className="section-eyebrow">{g.eyebrow}</p>
        <h2 id="guide-links-title" className="section-title mt-2">
          {g.title}
        </h2>
        {!compact && (
          <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-ink-muted">
            {g.subtitle}
          </p>
        )}
      </div>
      <ul className="guide-links-grid">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${locale}/articles/${item.slug}`}
              prefetch
              className="guide-links-card group"
            >
              <span className="guide-links-card-title">{item.title}</span>
              <span className="guide-links-card-excerpt">{item.excerpt}</span>
              <span className="guide-links-card-cta">
                {dict.articles.readMore} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={`/${locale}/articles`} prefetch className="guide-links-all btn-ghost mt-4 text-sm">
        {g.viewAll} →
      </Link>
    </section>
  );
}
