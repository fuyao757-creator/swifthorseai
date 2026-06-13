import { Fragment } from "react";
import type { Locale } from "@/lib/i18n";
import type { Company } from "@/lib/data";
import {
  getSubgroupLabel,
  groupModelsByVendor,
  type VendorModuleGroup,
} from "@/lib/model-groups";
import { companyAccent, companyLabel } from "@/lib/company-styles";
import { ModelCard } from "./ModelCard";

export { groupModelsByVendor };

export function ModelModule({
  company,
  subgroups,
  locale,
  vendorLabel,
  viewDetailsLabel,
  parametersLabel,
  contextLabel,
}: {
  company: Company;
  subgroups: VendorModuleGroup["subgroups"];
  locale: Locale;
  vendorLabel: string;
  viewDetailsLabel: string;
  parametersLabel: string;
  contextLabel: string;
}) {
  const accent = companyAccent[company] ?? companyAccent.other;
  const code = companyLabel[company] ?? companyLabel.other;
  const totalModels = subgroups.reduce((n, sg) => n + sg.models.length, 0);
  const isZh = locale === "zh-CN";

  return (
    <section className="catalog-vendor-section" id={`vendor-${company}`}>
      <header className="catalog-vendor-head">
        <div
          className="catalog-vendor-badge"
          style={{
            backgroundColor: accent,
            boxShadow: `0 4px 16px -4px ${accent}45`,
          }}
        >
          {code}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="catalog-vendor-title">{vendorLabel}</h3>
          <p className="catalog-vendor-meta">
            {isZh
              ? `${subgroups.length} 系列 · ${totalModels} 款模型`
              : `${subgroups.length} series · ${totalModels} models`}
          </p>
        </div>
      </header>

      <div className="catalog-vendor-body">
        <div className="catalog-model-grid catalog-vendor-model-grid">
          {subgroups.map((sg) => (
            <Fragment key={sg.id}>
              {sg.models.length > 1 && (
                <div
                  className="catalog-subgroup-head catalog-subgroup-head-inline"
                  id={`vendor-${company}-${sg.id}`}
                >
                  <h4 className="catalog-subgroup-title">
                    {getSubgroupLabel(sg.labels, locale)}
                  </h4>
                  <span
                    className="catalog-subgroup-count"
                    style={{
                      color: accent,
                      borderColor: `${accent}30`,
                      backgroundColor: `${accent}10`,
                    }}
                  >
                    {isZh ? `${sg.models.length} 款` : `${sg.models.length}`}
                  </span>
                </div>
              )}
              {sg.models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  locale={locale}
                  viewDetailsLabel={viewDetailsLabel}
                  parametersLabel={parametersLabel}
                  contextLabel={contextLabel}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
