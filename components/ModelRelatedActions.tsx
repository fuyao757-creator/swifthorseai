import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import type { Scenario } from "@/lib/match-reference/engine";
import {
  buildMatchUrl,
  buildPromptsUrl,
  buildServicesUrl,
  inferMatchScenarioFromModel,
  inferPromptSceneFromModel,
  isComparableModel,
  matchScenarioToPromptScene,
} from "@/lib/model-workflow";

export function ModelRelatedActions({
  locale,
  dict,
  modelId,
  modelName,
  variant = "detail",
}: {
  locale: Locale;
  dict: Dictionary;
  modelId: string;
  modelName?: string;
  variant?: "detail" | "compact";
}) {
  const w = dict.workflow;
  const comparable = isComparableModel(modelId);
  const scenario = inferMatchScenarioFromModel(modelId);
  const scene = inferPromptSceneFromModel(modelId);

  const actions = [
    comparable
      ? {
          href: buildServicesUrl(locale, [modelId]),
          label: w.compareModel,
          icon: "⬡",
        }
      : null,
    {
      href: buildMatchUrl(locale, scenario ? { scenario } : undefined),
      label: w.matchScenario,
      icon: "⇄",
    },
    {
      href: buildPromptsUrl(locale, {
        scene,
        models: comparable ? [modelId] : undefined,
      }),
      label: w.writePrompt,
      icon: "✦",
    },
  ].filter(Boolean) as { href: string; label: string; icon: string }[];

  if (!actions.length) return null;

  return (
    <section
      className={
        variant === "compact"
          ? "model-related-actions model-related-actions-compact"
          : "model-related-actions"
      }
      aria-label={w.relatedTitle}
    >
      {variant === "detail" ? (
        <>
          <p className="mono-label">{w.relatedTitle}</p>
          {modelName ? (
            <p className="model-related-actions-sub">
              {w.relatedFor.replace("{name}", modelName)}
            </p>
          ) : null}
        </>
      ) : null}
      <div className="model-related-actions-grid">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="model-related-action">
            <span className="model-related-action-icon" aria-hidden>
              {action.icon}
            </span>
            <span>{action.label}</span>
            <span className="model-related-action-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ModelBatchActions({
  locale,
  dict,
  modelIds,
  scenario,
}: {
  locale: Locale;
  dict: Dictionary;
  modelIds: string[];
  scenario?: Scenario;
}) {
  const w = dict.workflow;
  const ids = modelIds.filter(Boolean);
  if (!ids.length) return null;

  const scene = scenario ? matchScenarioToPromptScene(scenario) : undefined;

  return (
    <div className="model-batch-actions">
      {ids.length >= 2 ? (
        <Link href={buildServicesUrl(locale, ids)} className="btn-ghost text-sm">
          {w.compareSelected} →
        </Link>
      ) : null}
      <Link
        href={buildPromptsUrl(locale, { scene, models: ids })}
        className="btn-ghost text-sm"
      >
        {w.writePrompt} →
      </Link>
    </div>
  );
}
