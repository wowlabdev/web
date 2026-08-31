"use client";

import type { ReactNode } from "react";

import { useBoolean, useKeyPress } from "ahooks";
import { createContext, use, useMemo } from "react";

import type { SearchEntry } from "@/lib/search/search";

import { createSearchIndex } from "@/lib/search/search";

type SearchContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  openSearch: () => void;
  search: (query: string, limit?: number) => SearchEntry[];
};

const SearchContext = createContext<SearchContextValue | null>(null);

type SearchIslandProps = {
  children: ReactNode;
  entries: SearchEntry[];
};

export function SearchIsland({
  children,
  entries,
}: Readonly<SearchIslandProps>) {
  const [isOpen, { set: setOpen, setTrue: openSearch, toggle: toggleOpen }] =
    useBoolean(false);

  const search = useMemo(() => createSearchIndex(entries), [entries]);

  useKeyPress(["meta.k", "ctrl.k"], (e) => {
    e.preventDefault();
    toggleOpen();
  });

  return (
    <SearchContext value={{ isOpen, openSearch, search, setOpen }}>
      {children}
    </SearchContext>
  );
}

export function useSearch() {
  const ctx = use(SearchContext);

  if (!ctx) {
    throw new Error("useSearch must be used within <SearchIsland>");
  }

  return ctx;
}
