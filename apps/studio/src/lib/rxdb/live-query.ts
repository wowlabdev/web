"use client";

import { useLiveQuery } from "@tanstack/react-db";

import type { QueryListResult, QueryResult } from "@/lib/data/result";

const SERVER_RESULT = {
  collection: undefined,
  data: undefined,
  isCleanedUp: false,
  isEnabled: false,
  isError: false,
  isIdle: true,
  isLoading: false,
  isReady: false,
  state: undefined,
  status: "disabled",
};

function useRxLiveQueryImpl(...args: unknown[]): unknown {
  if (typeof window === "undefined") {
    return SERVER_RESULT;
  }

  // eslint-disable-next-line @eslint-react/rules-of-hooks -- TanStack live queries cannot run during client-component SSR without IndexedDB
  return (useLiveQuery as (...rest: unknown[]) => unknown)(...args);
}

// Disabled on the server where IndexedDB (and the underlying RxDB collection) does not exist.
export const useRxLiveQuery = useRxLiveQueryImpl as typeof useLiveQuery;

type LiveResult<T> = {
  data: readonly T[] | undefined;
  isError: boolean;
  isLoading: boolean;
};

export function toListResult<T>(result: LiveResult<T>): QueryListResult<T> {
  const isLoading = result.isLoading || result.data === undefined;

  return {
    data: result.data as T[] | undefined,
    error: null,
    isError: result.isError,
    isFetching: isLoading,
    isLoading,
  };
}

export function toSingleResult<T>(result: LiveResult<T>): QueryResult<T> {
  const isLoading = result.isLoading || result.data === undefined;

  return {
    data: result.data?.[0],
    error: null,
    isError: result.isError,
    isFetching: isLoading,
    isLoading,
    notFound:
      !result.isError && result.data !== undefined && result.data.length === 0,
  };
}
