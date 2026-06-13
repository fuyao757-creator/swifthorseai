import Link from "next/link";

import type { Locale } from "@/lib/i18n";

import type { Dictionary } from "@/lib/dictionary";

import { SCENARIO_CATEGORIES } from "@/lib/model-scenarios";

import { LandingHorseAtmosphere } from "./LandingHorseAtmosphere";

import dynamic from "next/dynamic";

const LandingHorseLayer = dynamic(
  () => import("./LandingHorseLayer").then((m) => m.LandingHorseLayer),
  { ssr: false }
);

import { LandingWorkflowStrip } from "./LandingWorkflowStrip";

import { LandingTechDecor } from "./LandingTechDecor";

const MODULE_KEYS = [

  "models",

  "match",

  "prompts",

  "services",

] as const;



const MODULE_HREFS: Record<(typeof MODULE_KEYS)[number], string> = {

  models: "/models",

  match: "/match",

  prompts: "/prompts",

  services: "/services",

};



const MODULE_ICONS: Record<(typeof MODULE_KEYS)[number], string> = {

  models: "◈",

  match: "⇄",

  prompts: "✦",

  services: "⬡",

};



export function LandingPage({

  locale,

  dict,

  stats,

}: {

  locale: Locale;

  dict: Dictionary;

  stats: { models: number; providers: number };

}) {

  const l = dict.landing;

  const isZh = locale === "zh-CN";

  const heroSecondLine = l.heroTitleSecond || null;



  return (

    <div className="landing-page landing-page--ready landing-page--tech">
      <section className="landing-hero glass-hero relative overflow-hidden">

        <span className="tech-corners" aria-hidden />

        <div className="landing-hero-bg" aria-hidden>

          <LandingTechDecor zone="hero" />

          <span className="landing-orb landing-orb-a" />

          <span className="landing-orb landing-orb-b" />

          <span className="landing-orb landing-orb-c" />

          <span className="landing-grid-fade" />

        </div>

        <LandingHorseAtmosphere />
        <LandingHorseLayer />

        <div className="landing-hero-content relative z-10">

          <div className="landing-hero-copy relative z-20">

            <span className="landing-hero-copy-backdrop" aria-hidden />

            <span className="landing-hero-copy-glow" aria-hidden />

            <div className="landing-hero-meta">

              <span className="landing-badge">{l.badge}</span>

              <span className="landing-hero-code mono-label">

                <span className="landing-hero-live" aria-hidden />

                {l.heroCode}

              </span>

            </div>



            <h1 className="display-hero landing-hero-title">

              {heroSecondLine ? (

                <>

                  <span className="landing-hero-line">

                    {l.heroLead}

                    <span className="gradient-text">{l.heroHighlight}</span>

                  </span>

                  <span className="landing-hero-line landing-hero-line-second">

                    {heroSecondLine}

                  </span>

                </>

              ) : (

                <span className="landing-hero-line landing-hero-line-single landing-hero-title-parts">

                  <span>{l.heroLead}</span>

                  <span className="gradient-text">{l.heroHighlight}</span>

                  <span>{l.heroTail}</span>

                </span>

              )}

            </h1>



            <p className="landing-hero-subtitle">{l.heroSubtitle}</p>



            <div className="landing-hero-actions">

              <Link href={`/${locale}/models`} prefetch className="btn-primary landing-hero-cta-primary">

                {l.ctaModels} →

              </Link>

              <Link href={`/${locale}/match`} prefetch className="btn-ghost landing-hero-cta-secondary">

                {l.ctaMatch}

              </Link>

            </div>

          </div>



          <div className="landing-hero-foot">

            <div className="landing-hero-stats">

              <div className="landing-stat">

                <p className="landing-stat-label">{l.statModels}</p>

                <p className="landing-stat-value">{stats.models}</p>

              </div>

              <div className="landing-stat">

                <p className="landing-stat-label">{l.statProviders}</p>

                <p className="landing-stat-value landing-stat-accent-jade">

                  {stats.providers}

                </p>

              </div>

              <div className="landing-stat">

                <p className="landing-stat-label">{l.statScenarios}</p>

                <p className="landing-stat-value landing-stat-accent-cyan">

                  {SCENARIO_CATEGORIES.length}

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>



      <section className="landing-modules-section mt-10 lg:mt-12" aria-labelledby="landing-modules-title">

        <LandingTechDecor zone="modules" />
        <span className="tech-corners landing-section-corners opacity-25" aria-hidden />

        <div className="relative z-10 mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="section-eyebrow">{l.modulesEyebrow}</p>

            <h2 id="landing-modules-title" className="section-title mt-2">

              {l.modulesTitle}

            </h2>

            <p className="mt-2 max-w-xl text-pretty text-base leading-relaxed text-ink-muted">

              {l.modulesSubtitle}

            </p>

          </div>

          <Link href={`/${locale}/models`} prefetch className="btn-ghost relative z-20 shrink-0 text-sm">

            {l.viewAllModels} →

          </Link>

        </div>



        <div className="relative z-10 landing-module-grid">

          {MODULE_KEYS.map((key, index) => {

            const mod = l.modules[key];

            return (

              <Link

                key={key}

                href={`/${locale}${MODULE_HREFS[key]}`}

                prefetch

                className="landing-module-card group"

              >

                <div className="landing-module-header">

                  <span className="landing-module-icon-wrap" aria-hidden>

                    {MODULE_ICONS[key]}

                  </span>

                  <span className="landing-module-index">

                    {String(index + 1).padStart(2, "0")}

                  </span>

                </div>

                <div className="landing-module-title">{mod.title}</div>

                <p className="landing-module-desc">{mod.desc}</p>

                <span className="landing-module-cta">

                  {mod.cta}

                  <span className="landing-module-cta-arrow" aria-hidden>

                    →

                  </span>

                </span>

                <span className="landing-module-glow" aria-hidden />

              </Link>

            );

          })}

        </div>

        <LandingWorkflowStrip locale={locale} dict={dict} />

      </section>



      <section className="landing-pipeline mt-8 lg:mt-10">

        <div className="glass landing-pipeline-panel relative overflow-hidden p-8 sm:p-10 lg:p-12">

          <LandingTechDecor zone="pipeline" />

          <div className="relative z-10">
          <p className="mono-label">{l.pipelineEyebrow}</p>

          <h2 className="display-title mt-4 text-2xl sm:text-3xl">{l.pipelineTitle}</h2>

          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-ink-muted">

            {l.pipelineSubtitle}

          </p>

          <ol className="landing-pipeline-steps mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">

            {l.pipelineSteps.map((step, i) => (

              <li key={step.title} className="landing-pipeline-step">

                <span className="landing-pipeline-num">{i + 1}</span>

                <h3 className="font-display text-lg font-semibold">{step.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.desc}</p>

              </li>

            ))}

          </ol>
          </div>

        </div>

      </section>



      <section className="landing-cta mt-8 lg:mt-10">

        <div className="landing-cta-inner relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950 via-[#0a0f1a] to-slate-950 px-8 py-14 text-center sm:rounded-3xl sm:px-12 sm:py-16 dark:border-cyan-400/15">

          <div className="landing-cta-shimmer" aria-hidden />

          <div className="tech-corners opacity-40" aria-hidden />

          <p className="mono-label text-cyan-400/90">{l.ctaEyebrow}</p>

          <h2 className="display-title mt-4 text-2xl text-white sm:text-3xl">

            {l.ctaTitle}

          </h2>

          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-stone-400">

            {l.ctaSubtitle}

          </p>

          <div className="landing-cta-actions mt-8 flex flex-wrap justify-center gap-4">

            <Link

              href={`/${locale}/models`}

              prefetch

              className="landing-cta-btn rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-3.5 text-sm font-semibold tracking-tight text-white shadow-glow-cyan transition hover:brightness-105"

            >

              {l.ctaModels}

            </Link>

            <Link

              href={`/${locale}/prompts`}

              prefetch

              className="landing-cta-btn rounded-xl border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"

            >

              {l.ctaPrompts}

            </Link>

          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-stone-500">

            {l.ctaFootnote}

          </p>

        </div>

      </section>

    </div>

  );

}


