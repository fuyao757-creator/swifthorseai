"use client";

import type { ScenarioFilter as ScenarioFilterValue } from "@/lib/model-scenarios";

type FilterOption = { value: ScenarioFilterValue; label: string };

export function ScenarioFilter({
  options,
  active,
  onChange,
}: {
  options: FilterOption[];
  active: ScenarioFilterValue;
  onChange: (value: ScenarioFilterValue) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={
            active === opt.value ? "filter-chip filter-chip-active" : "filter-chip"
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
