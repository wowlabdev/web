import type { QueryListResult, QueryResult } from "@/lib/data/result";

export type ResultState = "empty" | "error" | "loading" | "notFound" | "ok";

export function resultState(
  result: QueryListResult<unknown> | QueryResult<unknown>,
): ResultState {
  if (result.isLoading) {
    return "loading";
  }

  if (result.isError) {
    return "error";
  }

  if ("notFound" in result && result.notFound) {
    return "notFound";
  }

  const { data } = result;

  if (data === undefined) {
    return "loading";
  }

  if (Array.isArray(data) && data.length === 0) {
    return "empty";
  }

  return "ok";
}
