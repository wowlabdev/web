"use client";

import { useMemo } from "react";

import type { QueryListResult, QueryResult } from "@/lib/data/result";

import type { BulkRow } from "./bulk-store";

import { getBulkRows, indexBulkBy } from "./bulk-store";
import { bulkListResult, bulkSingleResult, useBulkReady } from "./use-bulk";

export type ClassRow = BulkRow<"classes">;

export function useClass(classId: number): QueryResult<ClassRow> {
  const ready = useBulkReady();

  return useMemo(
    () => bulkSingleResult(ready, indexBulkBy("classes", "id").get(classId)),
    [ready, classId],
  );
}

export function useClassList(): QueryListResult<ClassRow> {
  const ready = useBulkReady();

  return useMemo(() => {
    const rows = [...getBulkRows("classes")];

    rows.sort((a, b) => a.name.localeCompare(b.name));

    return bulkListResult(ready, rows);
  }, [ready]);
}
