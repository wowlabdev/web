"use client";

import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

import type { DifficultyScope, JournalTab } from "./types";

import { difficultyScopes, journalTabs } from "./types";

export const JOURNAL_QUERY_PARSERS = {
  difficulty: parseAsStringLiteral(difficultyScopes).withDefault("all"),
  encounter: parseAsString.withDefault(""),
  instance: parseAsString.withDefault(""),
  q: parseAsString.withDefault(""),
  tab: parseAsStringLiteral(journalTabs).withDefault("raids"),
} as const;

export type JournalQuery = {
  difficulty: DifficultyScope;
  encounter: string;
  instance: string;
  q: string;
  tab: JournalTab;
};

export function useJournalQuery(): {
  query: JournalQuery;
  setQuery: (updates: Partial<JournalQuery>) => void;
} {
  const [query, setQueryStates] = useQueryStates(JOURNAL_QUERY_PARSERS, {
    history: "replace",
  });

  function setQuery(updates: Partial<JournalQuery>) {
    void setQueryStates(updates);
  }

  return { query, setQuery };
}
