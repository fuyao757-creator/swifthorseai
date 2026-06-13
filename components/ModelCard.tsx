"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import { localizeModel, type Model } from "@/lib/data";
import { companyAccent } from "@/lib/company-styles";

export function ModelCard({
  model,
  locale,
  viewDetailsLabel,
  parametersLabel,
  contextLabel,
}: {
  model: Model;
  locale: Locale;
  viewDetailsLabel: string;
  parametersLabel: string;
  contextLabel: string;
}) {
  const m = localizeModel(model, locale);
  const accent = companyAccent[model.company] ?? companyAccent.other;
  const href = `/${locale}/models/${model.id}`;

  return (
    <Link
      href={href}
      prefetch
      className="module-model-item group relative flex h-full min-h-[10rem] touch-manipulation flex-col cursor-pointer no-underline"
      style={
        {
          "--card-accent": accent,
        } as CSSProperties
      }
    >
      <div className="module-model-body relative z-10 flex flex-1 flex-col">
        <div className="module-model-head">
          <h4 className="module-model-title">{m.name}</h4>
          <span className="module-model-id" title={model.id}>
            {model.id}
          </span>
        </div>

        <p className="module-model-intro">{m.tagline}</p>

        <dl className="module-model-specs">
          <div className="module-model-spec">
            <dt>{parametersLabel}</dt>
            <dd>{m.parameters}</dd>
          </div>
          <div className="module-model-spec">
            <dt>{contextLabel}</dt>
            <dd>{m.contextWindow}</dd>
          </div>
        </dl>
      </div>

      <div className="module-model-footer relative z-10 mt-auto">
        <span className="module-model-cta">{viewDetailsLabel}</span>
        <span className="module-model-arrow" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
