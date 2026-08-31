"use client";

import { useMemo } from "react";

import { useEditorUi } from "../editor-store-provider";
import { firingCountKey } from "./utils";
import { walkDecisions } from "./walk-decisions";

export type FiringCounts = ReadonlyMap<string, number>;

export function useFiringCounts(): FiringCounts {
  const trace = useEditorUi((s) => s.trace);

  return useMemo(() => {
    const acc = new Map<string, number>();

    if (trace) {
      walkDecisions(trace.decisions, (decision) => {
        if (decision.firedActionIndex !== undefined) {
          const key = firingCountKey(
            decision.listId,
            decision.firedActionIndex,
          );

          acc.set(key, (acc.get(key) ?? 0) + 1);
        }
      });
    }

    return acc;
  }, [trace]);
}
