"use client";

import { XIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { cn } from "@wowlab/shared/lib/utils";

import { type FilterKey, FILTERS } from "./filters";
import { useCategoryLabels } from "./use-category-labels";

type SearchFilterBarProps = {
  activeFilters: Set<FilterKey>;
  onClear: () => void;
  onToggle: (key: FilterKey) => void;
};

export function SearchFilterBar({
  activeFilters,
  onClear,
  onToggle,
}: Readonly<SearchFilterBarProps>) {
  const content = useIntlayer("search");
  const labels = useCategoryLabels();
  const hasFilters = activeFilters.size > 0;

  return (
    <div className="flex items-center gap-1 border-b px-2 py-1.5">
      {FILTERS.map(({ icon: Icon, key }) => {
        const isActive = activeFilters.has(key);

        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={cn(
              "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[11px] transition-colors",
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            <Icon className="!size-3" />
            {labels[key]}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "ml-auto inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] transition-opacity",
          hasFilters
            ? "text-muted-foreground opacity-100 hover:text-foreground"
            : "pointer-events-none opacity-0",
        )}
      >
        <XIcon className="!size-3" />
        {content.clear}
      </button>
    </div>
  );
}
