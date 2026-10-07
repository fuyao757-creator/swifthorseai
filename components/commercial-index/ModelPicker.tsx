"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

const MAX_SELECT = 3;

export function ModelPicker({
  locale,
  title,
  hint,
  selectedIds,
  models,
}: {
  locale: Locale;
  title: string;
  hint: string;
  selectedIds: string[];
  models: { id: string; name: string; vendor: string }[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(selectedIds);
  const selectedKey = selectedIds.join(",");

  useEffect(() => {
    setSelected(selectedKey ? selectedKey.split(",") : []);
  }, [selectedKey]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((x) => x !== id);
        const href = next.length
          ? `/${locale}/services?models=${next.join(",")}`
          : `/${locale}/services`;
        router.replace(href, { scroll: false });
        return next;
      }
      if (prev.length >= MAX_SELECT) return prev;
      const next = [...prev, id];
      router.replace(`/${locale}/services?models=${next.join(",")}`, {
        scroll: false,
      });
      return next;
    });
  };

  return (
    <div className="access-ref-panel">
      <div className="access-ref-panel-head">
        <h2 className="font-display text-base font-semibold text-ink dark:text-white">
          {title}
        </h2>
        <span className="access-ref-count">
          {selected.length}/{MAX_SELECT}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">{hint}</p>

      <ul className="access-ref-model-list mt-4">
        {models.map((m) => {
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
                    {m.name}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-ink-faint">
                    {m.vendor}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
