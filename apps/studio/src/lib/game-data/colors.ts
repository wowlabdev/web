"use client";

import { useMemo } from "react";

import type { QueryListResult } from "@/lib/data/result";

import type { BulkRow } from "./bulk-store";

import { getBulkRows } from "./bulk-store";
import { bulkListResult, useBulkReady } from "./use-bulk";

export type GlobalColorRow = BulkRow<"global_colors">;

export function useGlobalColors(): QueryListResult<GlobalColorRow> {
  const ready = useBulkReady();

  return useMemo(
    () => bulkListResult(ready, getBulkRows("global_colors")),
    [ready],
  );
}
