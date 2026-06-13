import type { Metadata } from "next";
import Image from "next/image";
import { type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { BackLink } from "@/components/BackLink";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/about",
    title: `${dict.about.pageTitle} - ${dict.siteName}`,
    description: dict.about.pageSubtitle,
  });
}

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) return null;
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.about;
  const isZh = locale === "zh-CN";

  const quoteLines =
    t.storyQuoteItems ??
    t.storyQuote.split(/\s*[·•]\s*|\.\s+/).filter(Boolean);

  return (
    <article className="about-page">
      <BackLink href={`/${locale}`} label={dict.nav.backHome} />

      <header className="about-masthead glass-hero relative overflow-hidden">
        <span className="tech-corners opacity-40" aria-hidden />
        <div className="about-masthead-grid">
          <div className="about-masthead-copy">
            <div className="about-masthead-meta">
              <span className="badge">{t.badge}</span>
              <span className="mono-label">{t.heroMeta}</span>
            </div>
            <p className="about-masthead-tagline">{t.heroTagline}</p>
            <h1 className="about-masthead-title-en">{t.pageTitleEn}</h1>
            {isZh ? (
              <p className="about-masthead-title-local">{t.pageTitle}</p>
            ) : null}
            <p className="about-masthead-lead">{t.pageSubtitle}</p>
          </div>
          <div className="about-masthead-visual">
            <div className="about-masthead-frame">
              <Image
                src="/images/about-hero-tech-academic.jpg"
                alt={t.heroImageAlt}
                fill
                priority
                quality={92}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 720px"
              />
              <div className="about-masthead-frame-overlay" aria-hidden />
            </div>
          </div>
        </div>
      </header>

      <section className="about-principles" aria-labelledby="about-principles-heading">
        <div className="about-section-head">
          <p className="mono-label">PRINCIPLES</p>
          <h2 id="about-principles-heading" className="about-section-heading">
            {t.valuesHeading}
          </h2>
          <p className="about-section-intro">{t.valuesSubheading}</p>
        </div>
        <div className="about-principles-grid">
          {t.values.map((item, index) => (
            <article key={item.title} className="about-principle-card">
              <span className="about-principle-index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mono-label">{item.eyebrow}</p>
              <h3 className="about-principle-title">{item.title}</h3>
              <p className="about-principle-body">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="about-network-band" role="img" aria-label={t.networkImageAlt}>
        <Image
          src="/images/about-network-topology.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="about-network-band-overlay" aria-hidden />
        <p className="about-network-caption">
          <span>{t.networkCaption}</span>
          <span className="about-network-caption-divider" aria-hidden />
          <span className="about-network-caption-local">{t.networkCaptionLocal}</span>
        </p>
      </div>

      <section className="about-story glass-hero relative overflow-hidden">
        <span className="tech-corners opacity-30" aria-hidden />
        <div className="about-story-grid">
          <div className="about-story-aside">
            <p className="mono-label">{t.storyEyebrow}</p>
            <h2 className="about-section-heading mt-4">{t.storyTitle}</h2>
            <blockquote className="about-story-quote">
              <ul className="about-story-quote-lines" aria-label={t.storyQuote}>
                {quoteLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <footer>{t.storyQuoteLocal}</footer>
            </blockquote>
          </div>
          <div className="about-story-body">
            {t.storyParagraphs.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "about-story-lead"
                    : i === t.storyParagraphs.length - 1
                      ? "about-story-closing"
                      : "about-story-text"
                }
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="about-contribute" aria-labelledby="about-contribute-heading">
        <div className="about-contribute-panel">
          <div className="about-contribute-grid">
            <div className="about-contribute-copy">
              <p className="mono-label">{t.contactEyebrow}</p>
              <h2 id="about-contribute-heading" className="about-section-heading mt-4 text-white">
                {t.contactTitle}
              </h2>
              <p className="about-contribute-subtitle">{t.contactSubtitle}</p>
              <p className="about-contribute-body">{t.contactBody}</p>
              <p className="about-contribute-whatsapp">
                {t.contactWhatsAppLabel}：
                <a
                  href="https://wa.me/8613352297629"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.contactWhatsApp}
                </a>
              </p>
            </div>
            <div className="about-contribute-portrait">
              <Image
                src="/images/about-developer-portrait.jpg"
                alt={t.portraitImageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 380px"
              />
              <div className="about-contribute-portrait-overlay" aria-hidden />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
