"use client";

import { useMemo } from "react";

import type { QueryListResult } from "@/lib/data/result";
import type { GameRow } from "@wowlab/shared/lib/supabase/types";

import {
  type JournalEncounterEntry,
  JournalEncountersSchema,
  parse,
} from "@/lib/zod";

import type { BulkRow } from "./bulk-store";

import { getBulkRows } from "./bulk-store";
import { bulkListResult, useBulkReady } from "./use-bulk";

export type JournalInstance = {
  encounters: JournalEncounterEntry[];
  kind: "dungeon" | "raid" | "world";
} & Omit<
  JournalInstanceRow,
  "encounters" | "kind" | "patch_version" | "updated_at"
>;

export type JournalInstanceRow = GameRow<"journal_instances">;

type StoredJournalRow = BulkRow<"journal_instances">;

export function compareJournalInstances(
  a: JournalInstance,
  b: JournalInstance,
): number {
  return (
    Number(b.is_current_season) - Number(a.is_current_season) ||
    b.tier_id - a.tier_id ||
    a.tier_order_index - b.tier_order_index ||
    a.name.localeCompare(b.name)
  );
}

export function parseJournalEncounters(raw: unknown): JournalEncounterEntry[] {
  return parse(JournalEncountersSchema, raw, []).sort(
    (a, b) => a.order_index - b.order_index || a.id - b.id,
  );
}

export function toJournalInstance(
  row: StoredJournalRow,
  kind: "dungeon" | "raid",
): JournalInstance {
  return {
    ...row,
    encounters: parseJournalEncounters(row.encounters),
    kind,
  };
}

export function useJournalList(
  kind: "dungeon" | "raid",
): QueryListResult<JournalInstance> {
  const ready = useBulkReady();

  return useMemo(() => {
    const rows = getBulkRows("journal_instances")
      .filter((row) => row.kind === kind)
      .map((row) => toJournalInstance(row, kind))
      .sort(compareJournalInstances);

    return bulkListResult(ready, rows);
  }, [ready, kind]);
}
