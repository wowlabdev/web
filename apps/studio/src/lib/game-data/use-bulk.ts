"use client";

import { useSyncExternalStore } from "react";

import type { QueryListResult, QueryResult } from "@/lib/data/result";

import { useGameData } from "@/components/shared/islands/game-data-island";

import { isBulkReady, subscribeBulk } from "./bulk-store";

export function bulkListResult<T>(
  ready: boolean,
  data: T[],
): QueryListResult<T> {
  return {
    data: ready ? data : undefined,
    error: null,
    isError: false,
    isFetching: !ready,
    isLoading: !ready,
  };
}

export function bulkSingleResult<T>(
  ready: boolean,
  value: T | undefined,
): QueryResult<T> {
  return {
    data: ready ? value : undefined,
    error: null,
    isError: false,
    isFetching: !ready,
    isLoading: !ready,
    notFound: ready && value === undefined,
  };
}

export function useBulkReady(): boolean {
  useGameData();

  return useSyncExternalStore(subscribeBulk, isBulkReady, () => false);
}
