"use client";

import { useQueryStates } from "nuqs";

import type { PreviewFightStyle, PreviewTab } from "./constants";

import { PREVIEW_QUERY_PARSERS } from "./constants";

export type PreviewQuery = {
  archetype: PreviewFightStyle;
  collapsed: string[];
  duration: number;
  order: string[];
  seed: number;
  tab: PreviewTab;
  targets: number;
};

export function usePreviewQuery(): {
  query: PreviewQuery;
  setQuery: (updates: Partial<PreviewQuery>) => void;
} {
  const [query, setQueryStates] = useQueryStates(PREVIEW_QUERY_PARSERS, {
    history: "replace",
  });

  function setQuery(updates: Partial<PreviewQuery>) {
    void setQueryStates(updates);
  }

  return { query, setQuery };
}
