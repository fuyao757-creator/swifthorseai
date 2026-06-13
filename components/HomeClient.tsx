"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { CompanyFilter } from "./CompanyFilter";
import { ScenarioFilter } from "./ScenarioFilter";
import { ModelModule, groupModelsByVendor } from "./ModelModule";
import { ScenarioModule } from "./ScenarioModule";
import type { Company, Model } from "@/lib/data";
import {
  SCENARIO_CATEGORIES,
  filterModelsByScenario,
  groupModelsByScenario,
  type ScenarioFilter as ScenarioFilterValue,
} from "@/lib/model-scenarios";
import { getLocalizedValue } from "@/lib/i18n";
import { companyLabel } from "@/lib/company-styles";
import { LegalNotice } from "./LegalNotice";
import { BackLink } from "./BackLink";
import { ModelWorkflowNav } from "./ModelWorkflowNav";

type BrowseMode = "vendor" | "scenario";

export function HomeClient({
  models,
  locale,
  dict,
}: {
  models: Model[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [filter, setFilter] = useState<Company | "all">("all");
  const [browseMode, setBrowseMode] = useState<BrowseMode>("vendor");
  const [scenarioFilter, setScenarioFilter] = useState<ScenarioFilterValue>("all");

  const c = dict.catalog;
  const isZh = locale === "zh-CN";

  const providerCount = useMemo(
    () => new Set(models.map((m) => m.company)).size,
    [models]
  );

  const companyLabels: Record<Company, string> = {
    deepseek: dict.filter.deepseek,
    alibaba: dict.filter.alibaba,
    baidu: dict.filter.baidu,
    baichuan: dict.filter.baichuan,
    lingyi: dict.filter.lingyi,
    zhipu: dict.filter.zhipu,
    moonshot: dict.filter.moonshot,
    bytedance: dict.filter.bytedance,
    tencent: dict.filter.tencent,
    qihoo: dict.filter.qihoo,
    kunlun: dict.filter.kunlun,
    sensetime: dict.filter.sensetime,
    jd: dict.filter.jd,
    other: dict.filter.other,
  };

  const filterOptions: { value: Company | "all"; label: string }[] = [
    { value: "all", label: dict.filter.all },
    ...(
      Object.entries(companyLabels) as [Company, string][]
    ).map(([value, label]) => ({ value, label })),
  ];

  const scenarioOptions = useMemo(
    () => [
      { value: "all" as const, label: c.scenarioAll },
      ...SCENARIO_CATEGORIES.map((cat) => ({
        value: cat.id,
        label: getLocalizedValue(cat.labels, locale),
      })),
    ],
    [c.scenarioAll, locale]
  );

  const filtered = useMemo(() => {
    const byCompany =
      browseMode === "vendor" && filter !== "all"
        ? models.filter((m) => m.company === filter)
        : models;
    const activeScenario = browseMode === "scenario" ? scenarioFilter : "all";
    return filterModelsByScenario(byCompany, activeScenario);
  }, [models, filter, scenarioFilter, browseMode]);

  const vendorModules = useMemo(() => groupModelsByVendor(filtered), [filtered]);
  const scenarioGroups = useMemo(
    () =>
      groupModelsByScenario(
        filtered,
        browseMode === "scenario" ? scenarioFilter : "all"
      ),
    [filtered, scenarioFilter, browseMode]
  );

  const summaryText =
    browseMode === "vendor"
      ? isZh
        ? `${vendorModules.length} 厂商 · ${filtered.length} 款模型`
        : `${vendorModules.length} vendors · ${filtered.length} models`
      : isZh
        ? `${scenarioGroups.length} 场景 · ${filtered.length} 款模型`
        : `${scenarioGroups.length} scenarios · ${filtered.length} models`;

  return (
    <div className="catalog-page animate-fade-in">
      <BackLink href={`/${locale}`} label={dict.nav.backHome} />
      <ModelWorkflowNav locale={locale} dict={dict} current="models" />

      <section className="catalog-hero catalog-hero-compact glass-hero relative mb-8 overflow-hidden lg:mb-10">
        <div className="catalog-hero-bg" aria-hidden>
          <span className="landing-orb landing-orb-a" />
          <span className="landing-orb landing-orb-b" />
        </div>

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
          <div className="catalog-hero-top">
            <div className="catalog-hero-copy">
              <span className="badge">{c.pageBadge}</span>
              <h1 className="catalog-hero-title">{c.pageTitle}</h1>
              <p className="catalog-hero-subtitle">{c.pageSubtitle}</p>
            </div>
            <div className="catalog-hero-stats">
              <div className="catalog-stat-inline">
                <span className="catalog-stat-inline-value text-cinnabar">{models.length}</span>
                <span className="catalog-stat-inline-label">{c.statModels}</span>
              </div>
              <div className="catalog-stat-inline">
                <span className="catalog-stat-inline-value text-jade">{providerCount}</span>
                <span className="catalog-stat-inline-label">{c.statProviders}</span>
              </div>
            </div>
          </div>

          <div className="catalog-actions catalog-actions-compact">
            <Link href={`/${locale}/services`} className="catalog-action">
              <span className="catalog-action-icon">⬡</span>
              {dict.nav.services}
            </Link>
            <Link href={`/${locale}/match`} className="catalog-action">
              <span className="catalog-action-icon">⇄</span>
              {c.quickMatch}
            </Link>
            <Link href={`/${locale}/prompts`} className="catalog-action">
              <span className="catalog-action-icon">✦</span>
              {dict.nav.prompts}
            </Link>
          </div>
        </div>
      </section>

      <div className="catalog-shell">
        <aside className="catalog-sidebar">
          <div className="catalog-sidebar-panel">
            <p className="mono-label">{c.browseLabel}</p>
            <div className="catalog-segment catalog-segment-full mt-3" role="tablist" aria-label={c.browseLabel}>
              <button
                type="button"
                role="tab"
                aria-selected={browseMode === "vendor"}
                onClick={() => setBrowseMode("vendor")}
                className={
                  browseMode === "vendor"
                    ? "catalog-segment-btn catalog-segment-btn-active"
                    : "catalog-segment-btn"
                }
              >
                {c.browseByVendor}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={browseMode === "scenario"}
                onClick={() => setBrowseMode("scenario")}
                className={
                  browseMode === "scenario"
                    ? "catalog-segment-btn catalog-segment-btn-active"
                    : "catalog-segment-btn"
                }
              >
                {c.browseByScenario}
              </button>
            </div>

            {browseMode === "vendor" ? (
              <>
                <div className="catalog-sidebar-divider" />

                <p className="catalog-filter-label">{c.filterVendorLabel}</p>
                <div className="catalog-filter-chips">
                  <CompanyFilter
                    options={filterOptions}
                    active={filter}
                    onChange={setFilter}
                  />
                </div>

                {vendorModules.length > 1 ? (
                  <>
                    <div className="catalog-sidebar-divider" />
                    <p className="mono-label">{c.providerIndex}</p>
                    <nav className="catalog-index-nav" aria-label={c.providerJumpLinks}>
                      {vendorModules.map(({ company, subgroups }) => {
                        const count = subgroups.reduce((n, sg) => n + sg.models.length, 0);
                        return (
                          <a
                            key={company}
                            href={`#vendor-${company}`}
                            className="catalog-index-link"
                          >
                            <span className="catalog-index-code">{companyLabel[company] ?? companyLabel.other}</span>
                            <span className="catalog-index-name">{companyLabels[company]}</span>
                            <span className="catalog-index-count">{count}</span>
                          </a>
                        );
                      })}
                    </nav>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div className="catalog-sidebar-divider" />

                <p className="catalog-filter-label">{c.scenarioFilterLabel}</p>
                <div className="catalog-filter-chips">
                  <ScenarioFilter
                    options={scenarioOptions}
                    active={scenarioFilter}
                    onChange={setScenarioFilter}
                  />
                </div>
              </>
            )}
          </div>
        </aside>

        <div className="catalog-main">
          <header className="catalog-main-head">
            <div>
              <p className="section-eyebrow">
                {browseMode === "vendor" ? c.vendorEyebrow : c.scenarioEyebrow}
              </p>
              <h2 className="section-title mt-2">{c.listTitle}</h2>
            </div>
            <span className="catalog-results-pill">{summaryText}</span>
          </header>

          <div className="catalog-results">
            {browseMode === "vendor" ? (
              vendorModules.length > 0 ? (
                vendorModules.map(({ company, subgroups }) => (
                  <ModelModule
                    key={company}
                    company={company}
                    subgroups={subgroups}
                    locale={locale}
                    vendorLabel={companyLabels[company]}
                    viewDetailsLabel={dict.model.viewDetails}
                    parametersLabel={dict.model.parameters}
                    contextLabel={dict.model.context}
                  />
                ))
              ) : (
                <EmptyState locale={locale} message={c.noScenarioModels} />
              )
            ) : scenarioGroups.length > 0 ? (
              scenarioGroups.map((group) => (
                <ScenarioModule
                  key={group.id}
                  group={group}
                  locale={locale}
                  viewDetailsLabel={dict.model.viewDetails}
                  parametersLabel={dict.model.parameters}
                  contextLabel={dict.model.context}
                />
              ))
            ) : (
              <EmptyState locale={locale} message={c.noScenarioModels} />
            )}
          </div>
        </div>
      </div>

      <div className="tech-divider !my-10" />

      <LegalNotice linkHref={`/${locale}/disclaimer`} linkLabel={dict.footer.readMore}>
        {dict.footer.disclaimer} {dict.footer.trademark}
      </LegalNotice>
    </div>
  );
}

function EmptyState({ locale, message }: { locale: Locale; message: string }) {
  return (
    <div className="catalog-empty">
      <p className="text-ink-muted">
        {message || (locale === "zh-CN" ? "暂无匹配的模型" : "No models found.")}
      </p>
    </div>
  );
}
