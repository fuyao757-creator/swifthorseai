import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { notFound } from "next/navigation";
import { type Locale, isValidLocale, locales } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getModelById, getModels, localizeModel } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { companyAccent, companyLabel } from "@/lib/company-styles";
import { ModelWorkflowNav } from "@/components/ModelWorkflowNav";
import { ModelRelatedActions } from "@/components/ModelRelatedActions";
import { ModelJsonLd } from "@/components/ModelJsonLd";

export function generateStaticParams() {
  const models = getModels();
  return locales.flatMap((locale) =>
    models.map((m) => ({ locale, id: m.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const model = getModelById(params.id);
  if (!model) return { title: "Not Found" };
  const m = localizeModel(model, locale);
  return buildPageMetadata({
    locale,
    path: `/models/${params.id}`,
    title: `${m.name} - ${dict.siteName}`,
    description: m.tagline,
  });
}

function UseCaseTag({ category, label }: { category: string; label: string }) {
  const cls =
    category === "image"
      ? "tag-image"
      : category === "video"
        ? "tag-video"
        : "tag-text";
  return <span className={cls}>{label}</span>;
}

export default function ModelDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const model = getModelById(params.id);
  if (!model) notFound();

  const m = localizeModel(model, locale);
  const accent = companyAccent[model.company] ?? companyAccent.other;
  const code = companyLabel[model.company] ?? companyLabel.other;

  return (
    <article className="animate-fade-in">
      <ModelJsonLd model={model} locale={locale} />
      <BackLink
        href={`/${locale}/models`}
        label={dict.nav.backToModels}
      />
      <ModelWorkflowNav locale={locale} dict={dict} current="models" />
      <header className="glass-hero relative mb-14 lg:mb-16">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-[80px]"
          style={{ backgroundColor: `${accent}35` }}
        />
        <div className="relative px-8 py-12 sm:px-12 sm:py-14 lg:px-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl font-mono text-xl font-bold text-white shadow-soft-lg"
                style={{ backgroundColor: accent }}
              >
                {code}
              </div>
              <span className="badge">{m.companyName}</span>
            </div>
            <span className="mono-label">{model.id}</span>
          </div>
          <div className="accent-rule mt-6" />
          <h1 className="display-hero mt-7 max-w-4xl">{m.name}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-muted dark:text-stone-400">
            {m.tagline}
          </p>
        </div>
      </header>

      <section className="mb-12">
        <div className="flex flex-wrap gap-3">
          <span className="param-pill">
            <span className="text-ink-faint">{dict.model.parameters}</span>
            <strong className="text-ink dark:text-stone-100">
              {m.parameters}
            </strong>
          </span>
          <span className="param-pill">
            <span className="text-ink-faint">{dict.model.context}</span>
            <strong className="text-ink dark:text-stone-100">
              {m.contextWindow}
            </strong>
          </span>
          <span className="param-pill">
            <span className="text-ink-faint">{dict.model.knowledgeCutoff}</span>
            <strong className="text-ink dark:text-stone-100">
              {m.knowledgeCutoff}
            </strong>
          </span>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="section-title">{dict.model.description}</h2>
        <div className="card-static mt-8 space-y-6 p-8 sm:p-10">
          {m.description.map((para, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed text-ink-muted dark:text-stone-300"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="section-title">{dict.model.useCases}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {m.useCases.map((uc) => (
            <UseCaseTag key={uc.id} category={uc.category} label={uc.label} />
          ))}
        </div>
      </section>

      <ModelRelatedActions
        locale={locale}
        dict={dict}
        modelId={model.id}
        modelName={m.name}
      />
    </article>
  );
}
