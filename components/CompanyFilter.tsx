"use client";

import type { Company } from "@/lib/data";

type FilterOption = { value: Company | "all"; label: string };

export function CompanyFilter({
  options,
  active,
  onChange,
}: {
  options: FilterOption[];
  active: Company | "all";
  onChange: (value: Company | "all") => void;
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
