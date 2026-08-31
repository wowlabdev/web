"use client";

import { useMemo } from "react";

import { useGlobalStrings } from "@/lib/query/services";

import { getBulkRows } from "./bulk-store";
import { useBulkReady } from "./use-bulk";

export function usePowerTypeNames(): Record<number, string> {
  const ready = useBulkReady();

  const rows = useMemo(
    () => (ready ? getBulkRows("power_types") : []),
    [ready],
  );
  const tags = useMemo(
    () => rows.map((row) => row.name_global_string_tag),
    [rows],
  );
  const strings = useGlobalStrings(tags);

  return useMemo(() => {
    const map: Record<number, string> = {};

    for (const row of rows) {
      const name = strings[row.name_global_string_tag];

      if (name) {
        map[row.power_type_enum] = name;
      }
    }

    return map;
  }, [rows, strings]);
}
