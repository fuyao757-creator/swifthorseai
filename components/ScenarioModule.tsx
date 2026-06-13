import type { Locale } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/i18n";
import type { ScenarioGroup } from "@/lib/model-scenarios";
import { ModelCard } from "./ModelCard";

export function ScenarioModule({
  group,
  locale,
  viewDetailsLabel,
  parametersLabel,
  contextLabel,
}: {
  group: ScenarioGroup;
  locale: Locale;
  viewDetailsLabel: string;
  parametersLabel: string;
  contextLabel: string;
}) {
  const title = getLocalizedValue(group.labels, locale);
  const isZh = locale === "zh-CN";

  return (
    <section className="catalog-vendor-section" id={`scenario-${group.id}`}>
      <header className="catalog-vendor-head">
        <div
          className="catalog-vendor-badge"
          style={{
            backgroundColor: group.accent,
            boxShadow: `0 4px 16px -4px ${group.accent}45`,
          }}
        >
          {title.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="catalog-vendor-title">{title}</h3>
          <p className="catalog-vendor-meta">
            {isZh
              ? `${group.models.length} 款适用模型`
              : `${group.models.length} matching models`}
          </p>
        </div>
      </header>

      <div className="catalog-vendor-body">
        <div className="catalog-model-grid">
          {group.models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              locale={locale}
              viewDetailsLabel={viewDetailsLabel}
              parametersLabel={parametersLabel}
              contextLabel={contextLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
