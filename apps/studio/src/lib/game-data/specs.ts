"use client";

import { useMemo } from "react";

import type { QueryListResult, QueryResult } from "@/lib/data/result";

import type { BulkRow } from "./bulk-store";

import { getBulkRows, indexBulkBy } from "./bulk-store";
import { bulkListResult, bulkSingleResult, useBulkReady } from "./use-bulk";

export type SpecRow = BulkRow<"specs">;
export type SpecTraitsRow = BulkRow<"specs_traits">;

export function useSpec(specId: number): QueryResult<SpecRow> {
  const ready = useBulkReady();

  return useMemo(
    () => bulkSingleResult(ready, indexBulkBy("specs", "id").get(specId)),
    [ready, specId],
  );
}

export function useSpecList(): QueryListResult<SpecRow> {
  const ready = useBulkReady();

  return useMemo(() => {
    const rows = [...getBulkRows("specs")];

    rows.sort(
      (a, b) =>
        a.class_name.localeCompare(b.class_name) ||
        a.name.localeCompare(b.name),
    );

    return bulkListResult(ready, rows);
  }, [ready]);
}

export function useSpecTraits(specId: number): QueryResult<SpecTraitsRow> {
  const ready = useBulkReady();

  return useMemo(
    () =>
      bulkSingleResult(
        ready,
        indexBulkBy("specs_traits", "spec_id").get(specId),
      ),
    [ready, specId],
  );
}
