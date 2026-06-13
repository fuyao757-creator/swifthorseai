"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import {
  COMMERCIAL_INDEX_MODELS,
  getCompareCell,
  type CompareRowKey,
} from "@/lib/commercial-index/data";
import { BackLink } from "@/components/BackLink";
import { LegalNotice } from "@/components/LegalNotice";
import { ModelWorkflowNav } from "@/components/ModelWorkflowNav";
import { ModelBatchActions } from "@/components/ModelRelatedActions";
import {
  buildMatchUrl,
  buildPromptsUrl,
  parseModelIdsParam,
} from "@/lib/model-workflow";

const MAX_SELECT = 3;

type CompareGroup = {
  id: string;
  label: string;
  rows: CompareRowKey[];
};

export function CommercialIndexClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.commercialIndex;
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFromUrl = parseModelIdsParam(searchParams.get("models"));
  const [selected, setSelected] = useState<string[]>(
    initialFromUrl.length >= 2
      ? initialFromUrl.slice(0, MAX_SELECT)
      : ["deepseek-v4-pro", "qwen3-max", "glm-4-7"]
  );

  useEffect(() => {
    const fromUrl = parseModelIdsParam(searchParams.get("models"));
    if (fromUrl.length >= 2) {
      setSelected(fromUrl.slice(0, MAX_SELECT));
    }
  }, [searchParams]);

  useEffect(() => {
    if (selected.length < 2) return;
    const next = selected.join(",");
    const current = searchParams.get("models") ?? "";
    if (current === next) return;
    router.replace(`/${locale}/services?models=${next}`, { scroll: false });
  }, [selected, locale, router, searchParams]);

  const selectedModels = useMemo(
    () =>
      COMMERCIAL_INDEX_MODELS.filter((m) => selected.includes(m.id)).slice(
        0,
        MAX_SELECT
      ),
    [selected]
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, id];
    });
  };

  const loc = locale === "zh-CN" ? "zh-CN" : "en";

  const compareGroups: CompareGroup[] = [
    {
      id: "core",
      label: t.groupCore,
      rows: ["vendor", "parameters", "mmlu", "context", "maxOutput"],
    },
    {
      id: "capability",
      label: t.groupCapability,
      rows: ["modalities", "toolCalling", "strengths"],
    },
    {
      id: "access",
      label: t.groupAccess,
      rows: ["apiFormat", "deployment", "languages", "price", "cutoff"],
    },
  ];

  const rowLabels: Record<CompareRowKey, string> = {
    vendor: t.rowVendor,
    parameters: t.rowParameters,
    mmlu: t.rowMmlu,
    context: t.rowContext,
    maxOutput: t.rowMaxOutput,
    modalities: t.rowModalities,
    apiFormat: t.rowApiFormat,
    toolCalling: t.rowToolCalling,
    deployment: t.rowDeployment,
    languages: t.rowLanguages,
    price: t.rowPrice,
    cutoff: t.rowCutoff,
    strengths: t.rowStrengths,
  };

  const canCompare = selectedModels.length >= 2;

  return (
    <div className="access-ref-page animate-fade-in">
      <BackLink href={`/${locale}`} label={dict.nav.backHome} />
      <ModelWorkflowNav locale={locale} dict={dict} current="services" />

      <header className="access-ref-header glass-hero relative mb-8 overflow-hidden">
        <span className="tech-corners opacity-50" aria-hidden />
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="badge">{t.badge}</span>
            <span className="mono-label">PUBLIC · REFERENCE</span>
          </div>
          <h1 className="display-hero mt-6 max-w-3xl text-3xl sm:text-4xl lg:text-[2.75rem]">
            {t.pageTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {t.pageSubtitle}
          </p>
        </div>
      </header>

      <div className="access-ref-layout">
        <aside className="access-ref-sidebar">
          <div className="access-ref-panel">
            <div className="access-ref-panel-head">
              <h2 className="font-display text-base font-semibold text-ink dark:text-white">
                {t.pickerTitle}
              </h2>
              <span className="access-ref-count">
                {selected.length}/{MAX_SELECT}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">{t.compareHint}</p>

            <ul className="access-ref-model-list mt-4">
              {COMMERCIAL_INDEX_MODELS.map((m) => {
                const on = selected.includes(m.id);
                const disabled = !on && selected.length >= MAX_SELECT;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => toggle(m.id)}
                      className={`access-ref-model-btn ${on ? "access-ref-model-btn-on" : ""}`}
                      aria-pressed={on}
                    >
                      <span className="access-ref-model-check" aria-hidden>
                        {on ? "✓" : ""}
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate font-medium text-ink dark:text-white">
                          {m.name[loc]}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-faint">
                          {m.vendor[loc]}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="access-ref-panel mt-4">
            <h2 className="font-display text-base font-semibold text-ink dark:text-white">
              {t.guideTitle}
            </h2>
            <ol className="mt-4 space-y-3">
              {t.guideSteps.map((step, i) => (
                <li key={step.title} className="access-ref-guide-item">
                  <span className="resource-guide-num">{i + 1}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="access-ref-panel mt-4">
            <p className="mono-label">{t.relatedTitle}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href={`/${locale}/models`} className="access-ref-related-link">
                {dict.nav.models} →
              </Link>
              <Link href={buildMatchUrl(locale)} className="access-ref-related-link">
                {dict.nav.match} →
              </Link>
              <Link href={buildPromptsUrl(locale, { models: selected })} className="access-ref-related-link">
                {dict.nav.prompts} →
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <LegalNotice linkHref={`/${locale}/disclaimer`} linkLabel={dict.footer.readMore}>
              {t.disclosureBody}
            </LegalNotice>
          </div>
        </aside>

        <main className="access-ref-main">
          <div className="access-ref-workspace">
            <div className="access-ref-workspace-head">
              <div>
                <p className="section-eyebrow">{t.objectiveOnly}</p>
                <h2 className="section-title mt-2 text-xl sm:text-2xl">{t.compareTitle}</h2>
              </div>
              {canCompare && (
                <p className="access-ref-summary">
                  {t.compareSummary.replace("{count}", String(selectedModels.length))}
                </p>
              )}
            </div>

            {!canCompare ? (
              <div className="access-ref-empty">
                <p className="font-display text-lg font-semibold text-ink dark:text-white">
                  {t.emptyTitle}
                </p>
                <p className="mt-2 max-w-md text-sm text-ink-muted">{t.pickAtLeastTwo}</p>
              </div>
            ) : (
              <>
                <div className="access-ref-table-wrap overflow-x-auto">
                  <table className="compare-table w-full min-w-[40rem] text-left text-sm">
                    <thead>
                      <tr>
                        <th className="compare-table-label sticky left-0 z-[1] bg-white/95 backdrop-blur dark:bg-slate-950/95">
                          {t.paramLabel}
                        </th>
                        {selectedModels.map((m) => (
                          <th key={m.id} className="compare-table-head min-w-[9.5rem]">
                            <span className="block">{m.name[loc]}</span>
                            <Link
                              href={`/${locale}/models/${m.id}`}
                              className="mt-1 inline-block text-xs font-normal text-cyan-700 hover:underline dark:text-cyan-400"
                            >
                              {t.viewProfileShort}
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {compareGroups.map((group) => (
                        <Fragment key={group.id}>
                          <tr className="compare-table-group-row">
                            <td
                              colSpan={selectedModels.length + 1}
                              className="compare-table-group-label"
                            >
                              {group.label}
                            </td>
                          </tr>
                          {group.rows.map((key) => (
                            <tr key={key} className="compare-table-row">
                              <td className="compare-table-label sticky left-0 z-[1] bg-white/95 backdrop-blur dark:bg-slate-950/95">
                                {rowLabels[key]}
                              </td>
                              {selectedModels.map((m) => (
                                <td key={m.id} className="compare-table-cell">
                                  {getCompareCell(m, key, loc)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-ink-faint">
                  {t.objectiveFootnote}
                </p>
                <ModelBatchActions
                  locale={locale}
                  dict={dict}
                  modelIds={selectedModels.map((m) => m.id)}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
