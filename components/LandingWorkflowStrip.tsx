import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { WORKFLOW_MODULES } from "@/lib/model-workflow";

const MODULE_HREF: Record<(typeof WORKFLOW_MODULES)[number], string> = {
  models: "/models",
  services: "/services",
  match: "/match",
  prompts: "/prompts",
};

const MODULE_LABEL_KEY: Record<
  (typeof WORKFLOW_MODULES)[number],
  keyof Dictionary["nav"]
> = {
  models: "models",
  services: "services",
  match: "match",
  prompts: "prompts",
};

export function LandingWorkflowStrip({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const w = dict.workflow;

  return (
    <div className="landing-workflow-strip" aria-label={w.navLabel}>
      <p className="landing-workflow-strip-label">{w.eyebrow}</p>
      <ol className="landing-workflow-strip-steps">
        {WORKFLOW_MODULES.map((key, index) => (
          <li key={key} className="landing-workflow-strip-item">
            {index > 0 ? (
              <span className="landing-workflow-strip-sep" aria-hidden>
                →
              </span>
            ) : null}
            <Link href={`/${locale}${MODULE_HREF[key]}`} prefetch className="landing-workflow-strip-link">
              <span className="landing-workflow-strip-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{dict.nav[MODULE_LABEL_KEY[key]]}</span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="landing-workflow-strip-hint">{w.hint}</p>
    </div>
  );
}
