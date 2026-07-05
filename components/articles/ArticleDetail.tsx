import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import type { LocalizedArticle } from "@/lib/articles";
import { getModelById, localizeModel } from "@/lib/data";
import { buildMatchUrl, buildPromptsUrl } from "@/lib/model-workflow";
import { getRelatedGuideSlugs } from "@/lib/featured-guides";
import { getArticleBySlug } from "@/lib/articles";
import { getLocalizedValue } from "@/lib/i18n";

export function ArticleDetail({
  article,
  locale,
  dict,
}: {
  article: LocalizedArticle;
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.articles;
  const relatedModels = (article.relatedModelIds ?? [])
    .map((id) => getModelById(id))
    .filter(Boolean)
    .map((m) => localizeModel(m!, locale));

  const compareHref =
    relatedModels.length >= 2
      ? `/${locale}/services?models=${relatedModels
          .slice(0, 3)
          .map((m) => m.id)
          .join(",")}`
      : `/${locale}/services`;

  const relatedGuides = getRelatedGuideSlugs(article.slug, 4)
    .map((slug) => {
      const a = getArticleBySlug(slug);
      if (!a) return null;
      return { slug, title: getLocalizedValue(a.title, locale) };
    })
    .filter(Boolean) as { slug: string; title: string }[];

  return (
    <div className="article-detail">
      <div className="article-body">
        {article.sections.map((section, i) => (
          <section key={i} className="article-section">
            {section.heading && (
              <h2 className="article-section-heading">{section.heading}</h2>
            )}
            {section.paragraphs.map((paragraph, j) => (
              <p key={j} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {article.faqs && article.faqs.length > 0 && (
          <section className="article-section">
            <h2 className="article-section-heading">{t.faqHeading}</h2>
            {article.faqs.map((faq, i) => (
              <div key={i} className="article-faq-item">
                <h3 className="article-faq-question">{faq.question}</h3>
                <p className="article-paragraph">{faq.answer}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      <aside className="article-aside">
        {relatedModels.length > 0 && (
          <div className="article-aside-block">
            <p className="mono-label">{t.relatedModels}</p>
            <ul className="article-related-list">
              {relatedModels.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/${locale}/models/${m.id}`}
                    className="article-related-link"
                  >
                    {m.name}
                    <span className="article-related-vendor">{m.companyName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relatedGuides.length > 0 && (
          <div className="article-aside-block">
            <p className="mono-label">{dict.landing.guideLinksTitle}</p>
            <ul className="article-related-list">
              {relatedGuides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/${locale}/articles/${g.slug}`}
                    className="article-related-link"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="article-aside-block">
          <p className="mono-label">{t.nextSteps}</p>
          <div className="article-aside-actions">
            <Link href={compareHref} className="access-ref-related-link">
              {t.goCompare} →
            </Link>
            <Link href={buildMatchUrl(locale)} className="access-ref-related-link">
              {dict.workflow.goMatch} →
            </Link>
            <Link
              href={buildPromptsUrl(locale, {
                models: article.relatedModelIds ?? [],
              })}
              className="access-ref-related-link"
            >
              {dict.workflow.goPrompts} →
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
