import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import type { WorkflowModule } from "@/lib/model-workflow";
import { WORKFLOW_MODULES } from "@/lib/model-workflow";

const MODULE_HREF: Record<WorkflowModule, string> = {
  models: "/models",
  services: "/services",
  match: "/match",
  prompts: "/prompts",
};

export function ModelWorkflowNav({
  locale,
  dict,
  current,
}: {
  locale: Locale;
  dict: Dictionary;
  current: WorkflowModule;
}) {
  const w = dict.workflow;
  const labels: Record<WorkflowModule, string> = {
    models: dict.nav.models,
    services: dict.nav.services,
    match: dict.nav.match,
    prompts: dict.nav.prompts,
  };

  return (
    <nav
      className="model-workflow-nav"
      aria-label={w.navLabel}
    >
      <p className="model-workflow-nav-eyebrow">{w.eyebrow}</p>
      <ol className="model-workflow-nav-steps">
        {WORKFLOW_MODULES.map((key, index) => {
          const active = key === current;
          return (
            <li key={key} className="model-workflow-nav-item">
              {index > 0 ? (
                <span className="model-workflow-nav-sep" aria-hidden>
                  →
                </span>
              ) : null}
              {active ? (
                <span className="model-workflow-nav-link model-workflow-nav-link-active">
                  <span className="model-workflow-nav-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {labels[key]}
                </span>
              ) : (
                <Link
                  href={`/${locale}${MODULE_HREF[key]}`}
                  className="model-workflow-nav-link"
                >
                  <span className="model-workflow-nav-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {labels[key]}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <p className="model-workflow-nav-hint">{w.hint}</p>
    </nav>
  );
}
