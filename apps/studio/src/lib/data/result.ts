import type { UseQueryResult } from "@tanstack/react-query";

export type QueryListResult<T> = {
  data: T[] | undefined;
  error: Error | null;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
};

export type QueryResult<T> = {
  data: T | undefined;
  error: Error | null;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  notFound: boolean;
};

export function toQueryListResult<T>(
  query: UseQueryResult<T[] | undefined>,
): QueryListResult<T> {
  return {
    data: query.data,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  };
}

export function toQueryResult<T>(
  query: UseQueryResult<T>,
): QueryResult<NonNullable<T>> {
  return {
    data: query.data ?? undefined,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    notFound: query.isSuccess && query.data == null,
  };
}
