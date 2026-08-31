"use client";

import { useCreation } from "ahooks";

import { dedupeSortIds } from "./ids";

export function useSortedIds(ids: number[]): number[] {
  const key = ids.join(",");

  return useCreation(
    () => dedupeSortIds(key.length > 0 ? key.split(",").map(Number) : []),
    [key],
  );
}
