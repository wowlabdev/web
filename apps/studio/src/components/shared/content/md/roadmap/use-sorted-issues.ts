"use client";

import { useMemoizedFn } from "ahooks";
import { useMemo, useState } from "react";

import type { Issue, SortMode } from "@/lib/github/types";

import { sortIssues } from "@/lib/github/sort-issues";

export function useSortedIssues(issues: Issue[]): {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  sortedIssues: Issue[];
} {
  const [sortMode, setSortMode] = useState<SortMode>("title-asc");
  const handleSortChange = useMemoizedFn((mode: SortMode) => {
    setSortMode(mode);
  });
  const sortedIssues = useMemo(
    () => sortIssues(issues, sortMode),
    [issues, sortMode],
  );

  return { setSortMode: handleSortChange, sortedIssues, sortMode };
}
