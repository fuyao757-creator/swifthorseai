"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import {
  computeMatches,
  MATCH_LAST_UPDATED,
  type Budget,
  type Deployment,
  type Language,
  type MatchAnswers,
  type MatchLevel,
  type MatchResult,
  type Scenario,
  type Volume,
} from "@/lib/match-reference/engine";

const STEPS = 5;

type StepKey = Exclude<keyof MatchAnswers, "mediaFocus">;

const QUESTION_KEYS: StepKey[] = [
  "scenario",
  "language",
  "volume",
  "budget",
  "deployment",
];

const OPTION_KEYS: Record<StepKey, string[]> = {
  scenario: [
    "customer-service",
    "coding",
    "content",
    "translation",
    "data-analysis",
    "general",
  ],
  language: ["zh", "en", "multilingual", "ja-ko"],
  volume: ["lt1k", "1k-10k", "10k-100k", "gt100k"],
  budget: ["lt50", "50-200", "200-1000", "unlimited"],
  deployment: ["cloud-api", "private", "both"],
};

function levelLabel(level: MatchLevel, t: Dictionary["modelMatch"]) {
  if (level === "high") return t.matchHigh;
  if (level === "mid-high") return t.matchMidHigh;
  return t.matchMid;
}

export function ModelMatchClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.modelMatch;
  const isZh = locale === "zh-CN";
  const labelSep = isZh ? "：" : ": ";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<MatchAnswers>>({});
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSelectHint, setShowSelectHint] = useState(false);

  const currentKey = QUESTION_KEYS[step];
  const selected = answers[currentKey];

  const results = useMemo(() => {
    if (!done || Object.keys(answers).length < STEPS) return [];
    return computeMatches(answers as MatchAnswers);
  }, [answers, done]);

  const pick = (value: string) => {
    setShowSelectHint(false);
    setAnswers((prev) => ({ ...prev, [currentKey]: value }));
    if (step < STEPS - 1) {
      window.setTimeout(() => setStep((s) => s + 1), 280);
    }
  };

  const canNext = Boolean(selected);
  const progress = done ? 100 : ((step + 1) / STEPS) * 100;

  const handleNext = () => {
    if (!canNext) {
      setShowSelectHint(true);
      return;
    }
    setShowSelectHint(false);
    if (step < STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  const formatResultText = (r: MatchResult) => {
    const name = isZh ? r.name["zh-CN"] : r.name.en;
    const vendor = isZh ? r.vendor["zh-CN"] : r.vendor.en;
    const desc = isZh ? r.description["zh-CN"] : r.description.en;
    const scenes = r.scenes
      .map((s) => (isZh ? s["zh-CN"] : s.en))
      .join(isZh ? "、" : ", ");
    const src = isZh ? r.dataSource["zh-CN"] : r.dataSource.en;
    const cost = isZh ? r.costRef["zh-CN"] : r.costRef.en;
    const header = isZh ? `${name}（${vendor}）` : `${name} (${vendor})`;
    return `${header}
${t.matchLevelLabel}${labelSep}${levelLabel(r.matchLevel, t)}
${desc}
${t.suitableScenes}${labelSep}${scenes}
${t.dataSourceLabel}${labelSep}${src}
${t.costRefLabel}${labelSep}${cost}`;
  };

  const copyAll = async () => {
    const header = `${t.pageTitle}\n${t.topBanner}\n\n`;
    const body = results.map(formatResultText).join("\n\n---\n\n");
    const footer = `\n\n${t.disclaimerTitle}\n${t.disclaimerBody}`;
    await navigator.clipboard.writeText(header + body + footer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    setFeedback(null);
    setCopied(false);
    setShowSelectHint(false);
  };

  return (
    <div className="animate-fade-in">
      <div
        className="mb-6 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300"
        role="status"
      >
        {t.topBanner}
      </div>

      <header className="mb-8">
        <p className="mono-label">{t.badge}</p>
        <h1 className="display-title mt-2 text-3xl sm:text-4xl">{t.pageTitle}</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">{t.pageSubtitle}</p>
      </header>

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-ink-muted">
          <span>
            {done
              ? t.progressDone
              : t.progressLabel.replace("{current}", String(step + 1)).replace("{total}", String(STEPS))}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-stone-200/80 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cinnabar to-jade transition-all duration-300 dark:from-tech-cyan dark:to-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {!done ? (
        <div className="glass p-6 sm:p-8">
          <h2 className="section-title text-lg">
            {t.questions[currentKey].title}
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {OPTION_KEYS[currentKey].map((opt) => {
              const on = selected === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => pick(opt)}
                  className={`rounded-xl border px-4 py-4 text-left text-sm transition-all ${
                    on
                      ? "border-ink bg-ink text-white dark:border-tech-cyan dark:bg-tech-cyan dark:text-[#06080f]"
                      : "border-stone-200/80 bg-white/80 hover:border-stone-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                  }`}
                >
                  {(
                    t.questions[currentKey].options as Record<string, string>
                  )[opt]}
                </button>
              );
            })}
          </div>

          {showSelectHint && !canNext && (
            <p
              className="mt-4 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100"
              role="alert"
            >
              {t.selectHint}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => {
                setShowSelectHint(false);
                setStep((s) => s - 1);
              }}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.prev}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`btn-primary ${!canNext ? "cursor-not-allowed opacity-50" : ""}`}
              aria-disabled={!canNext}
            >
              {step < STEPS - 1 ? t.next : t.viewResults}
            </button>
            <button type="button" onClick={reset} className="btn-ghost">
              {t.reset}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="section-title text-lg">{t.resultsTitle}</h2>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyAll} className="btn-ghost text-sm">
                {copied ? t.copied : t.copyAll}
              </button>
              <button type="button" onClick={reset} className="btn-ghost text-sm">
                {t.reset}
              </button>
            </div>
          </div>

          <p className="text-sm text-ink-muted">{t.resultsHint}</p>

          {results.length === 0 ? (
            <p
              className="rounded-xl border border-amber-300/60 bg-amber-50/90 px-4 py-4 text-sm leading-relaxed text-amber-950 dark:border-amber-500/35 dark:bg-amber-950/35 dark:text-amber-100"
              role="status"
            >
              {dict.modelMatchChat.noStrictMatch}
            </p>
          ) : (
          <div className="grid gap-5 lg:grid-cols-1">
            {results.map((r) => (
              <article
                key={r.id}
                className="card-static relative p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="display-title text-xl">
                      {locale === "zh-CN" ? r.name["zh-CN"] : r.name.en}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      {locale === "zh-CN" ? r.vendor["zh-CN"] : r.vendor.en}
                    </p>
                  </div>
                  <span className="rounded-lg border border-jade/30 bg-jade/10 px-3 py-1 text-xs font-medium text-jade dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {t.matchLevelLabel}{labelSep}{levelLabel(r.matchLevel, t)}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {locale === "zh-CN" ? r.description["zh-CN"] : r.description.en}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {r.scenes.map((s) => (
                    <span
                      key={s.en}
                      className="rounded-md bg-stone-100 px-2.5 py-1 text-xs text-ink-muted dark:bg-white/10"
                    >
                      {locale === "zh-CN" ? s["zh-CN"] : s.en}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <span
                    className="cursor-help rounded-md border border-stone-200/80 bg-stone-50 px-2 py-1 dark:border-white/10 dark:bg-white/5"
                    title={
                      locale === "zh-CN"
                        ? r.dataSourceDetail["zh-CN"]
                        : r.dataSourceDetail.en
                    }
                  >
                    {t.dataSourceLabel}{labelSep}{locale === "zh-CN" ? r.dataSource["zh-CN"] : r.dataSource.en}
                  </span>
                  <span className="text-ink-faint">
                    {t.costRefLabel}{labelSep}{locale === "zh-CN" ? r.costRef["zh-CN"] : r.costRef.en}
                  </span>
                </div>

                {r.catalogId && (
                  <Link
                    href={`/${locale}/models/${r.catalogId}`}
                    className="mt-4 inline-block text-sm font-medium text-cinnabar hover:underline dark:text-tech-cyan"
                  >
                    {t.catalogLink} →
                  </Link>
                )}
              </article>
            ))}
          </div>
          )}

          <div className="rounded-xl border border-stone-200/80 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-sm font-medium">{t.feedbackPrompt}</p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setFeedback("up")}
                className={`rounded-lg border px-4 py-2 text-lg transition-all ${
                  feedback === "up"
                    ? "border-jade bg-jade/10"
                    : "border-stone-200/80 hover:bg-stone-50 dark:border-white/10"
                }`}
                aria-label={t.feedbackUp}
              >
                👍
              </button>
              <button
                type="button"
                onClick={() => setFeedback("down")}
                className={`rounded-lg border px-4 py-2 text-lg transition-all ${
                  feedback === "down"
                    ? "border-cinnabar bg-cinnabar/10"
                    : "border-stone-200/80 hover:bg-stone-50 dark:border-white/10"
                }`}
                aria-label={t.feedbackDown}
              >
                👎
              </button>
            </div>
            {feedback && (
              <p className="mt-2 text-xs text-ink-muted">{t.feedbackThanks}</p>
            )}
          </div>
        </div>
      )}

      <footer
        className="benchmark-disclosure mt-12"
        role="contentinfo"
      >
        <h2 className="font-semibold">{t.disclaimerTitle}</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
          {t.disclaimerBody}
        </p>
        <p className="mt-3 font-mono text-xs opacity-80">
          {t.lastUpdated.replace("{date}", MATCH_LAST_UPDATED)}
        </p>
        <p className="mt-3">
          <Link
            href={`/${locale}/disclaimer`}
            className="font-mono text-xs font-semibold underline underline-offset-2"
          >
            {dict.footer.readMore} →
          </Link>
        </p>
      </footer>
    </div>
  );
}
