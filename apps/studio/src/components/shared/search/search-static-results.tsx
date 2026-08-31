"use client";

import { FileTextIcon } from "lucide-react";

import type { SearchEntry } from "@/lib/search/search";

import {
  CommandGroup,
  CommandItem,
} from "@wowlab/shared/components/ui/command";

import type { FilterKey } from "./filters";

import { CATEGORY_ICONS, FILTERS } from "./filters";

type SearchStaticResultsProps = {
  categoryLabels: Record<FilterKey, string>;
  onSelect: (path: string) => void;
  results: SearchEntry[];
};

export function SearchStaticResults({
  categoryLabels,
  onSelect,
  results,
}: Readonly<SearchStaticResultsProps>) {
  return groupByCategory(results).map(([category, entries]) => {
    const Icon = CATEGORY_ICONS[category] ?? FileTextIcon;
    const filter = FILTERS.find((entry) => entry.key === category);
    const heading = filter ? categoryLabels[filter.key] : undefined;

    return (
      <CommandGroup heading={heading} key={category}>
        {entries.map((entry) => (
          <CommandItem
            className="!items-start gap-2.5 !py-2"
            key={entry.id}
            onSelect={() => onSelect(entry.path)}
            value={entry.id}
          >
            <Icon className="text-muted-foreground mt-0.5 !size-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{entry.title}</div>
              {entry.description ? (
                <div className="text-muted-foreground truncate">
                  {entry.description}
                </div>
              ) : null}
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    );
  });
}

function groupByCategory(results: SearchEntry[]): [string, SearchEntry[]][] {
  const grouped = new Map<string, SearchEntry[]>();

  for (const result of results) {
    const entries = grouped.get(result.category);

    if (entries) {
      entries.push(result);
    } else {
      grouped.set(result.category, [result]);
    }
  }

  return [...grouped.entries()];
}
