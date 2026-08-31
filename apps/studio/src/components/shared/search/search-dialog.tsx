"use client";

import { useBoolean, useDebounce } from "ahooks";
import { DatabaseIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import { useSearch } from "@/components/shared/islands";
import { useItemSearch, useSpellSearch } from "@/lib/query/services";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@wowlab/shared/components/ui/command";
import { LogoSpinner } from "@wowlab/shared/components/ui/logo-spinner";
import { useLocalizedRouter } from "@wowlab/shared/lib/routing";

import { type FilterKey, FILTERS } from "./filters";
import { SearchFilterBar } from "./search-filter-bar";
import { SearchGameResults } from "./search-game-results";
import { SearchStaticResults } from "./search-static-results";
import { useCategoryLabels } from "./use-category-labels";
import { useEngineSearch } from "./use-engine-search";

export function SearchDialog() {
  const content = useIntlayer("search");
  const categoryLabels = useCategoryLabels();
  const { isOpen, search, setOpen } = useSearch();
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(
    () => new Set(),
  );
  const [
    isSearchAllEnabled,
    { setFalse: disableSearchAll, setTrue: enableSearchAll },
  ] = useBoolean(false);
  const router = useLocalizedRouter();

  const debouncedQuery = useDebounce(query, { wait: 300 });
  const hasGameQuery = debouncedQuery.length > 2;

  const staticResults = query.trim() ? search(query.trim(), 20) : [];
  const hasFilters = activeFilters.size > 0;
  const showCategory = (key: FilterKey) =>
    !hasFilters || activeFilters.has(key);
  const filtered = hasFilters
    ? staticResults.filter((result) =>
        FILTERS.some(
          (filter) =>
            filter.key === result.category && activeFilters.has(filter.key),
        ),
      )
    : staticResults;
  const engineMatches = useEngineSearch(query, isOpen);

  const spellResults = useSpellSearch(
    isSearchAllEnabled && hasGameQuery ? debouncedQuery : "",
  );
  const itemResults = useItemSearch(
    isSearchAllEnabled && hasGameQuery ? debouncedQuery : "",
  );

  const engineSpellIds = useMemo(
    () => new Set(engineMatches.map((e) => e.id)),
    [engineMatches],
  );
  const dedupedSpells = useMemo(
    () => spellResults.data?.filter((s) => !engineSpellIds.has(s.id)) ?? [],
    [spellResults.data, engineSpellIds],
  );
  const isLoadingSupabase =
    isSearchAllEnabled &&
    hasGameQuery &&
    (spellResults.isLoading || itemResults.isLoading);

  function toggleFilter(key: FilterKey) {
    setActiveFilters((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  function handleSelect(path: string) {
    router.push(path);
    setOpen(false);
    setQuery("");
    disableSearchAll();
  }

  function handleClose(next: boolean) {
    setOpen(next);

    if (!next) {
      setQuery("");
      setActiveFilters(new Set());
      disableSearchAll();
    }
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={handleClose}
      className="sm:max-w-xl"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={content.placeholder.value}
          value={query}
          onValueChange={(v) => {
            setQuery(v);
            disableSearchAll();
          }}
        />
        <SearchFilterBar
          activeFilters={activeFilters}
          onToggle={toggleFilter}
          onClear={() => setActiveFilters(new Set())}
        />
        <CommandList className="max-h-[min(60vh,420px)]">
          <CommandEmpty>
            {isLoadingSupabase ? content.searching : content.noResults}
          </CommandEmpty>

          <SearchStaticResults
            categoryLabels={categoryLabels}
            onSelect={handleSelect}
            results={filtered}
          />

          <SearchGameResults
            categoryLabels={categoryLabels}
            engineMatches={engineMatches}
            isItemsVisible={showCategory("Items")}
            isSearchAllEnabled={isSearchAllEnabled && hasGameQuery}
            isSpellsVisible={showCategory("Spells")}
            itemResults={itemResults.data ?? []}
            moreSpellResults={dedupedSpells}
            onSelect={handleSelect}
          />

          {isLoadingSupabase && (
            <div className="flex items-center justify-center gap-2 py-4">
              <LogoSpinner className="text-muted-foreground size-3.5" />
              <span className="text-muted-foreground text-xs">
                {content.searchingGameData}
              </span>
            </div>
          )}

          {hasGameQuery && !isSearchAllEnabled && (
            <div className="border-t px-2 py-2">
              <button
                type="button"
                onClick={enableSearchAll}
                className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-xs transition-colors hover:bg-muted"
              >
                <DatabaseIcon className="size-3.5" />
                {content.searchAllGameData}
              </button>
            </div>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
