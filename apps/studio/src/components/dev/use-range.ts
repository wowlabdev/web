"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";

import type { TimeRange } from "@/lib/metrics";

import { RANGES } from "@/lib/metrics";

export function useRange(queryKey: string, defaultValue: TimeRange = "1h") {
  return useQueryState(
    queryKey,
    parseAsStringLiteral(RANGES).withDefault(defaultValue).withOptions({
      history: "replace",
      shallow: false,
    }),
  );
}
