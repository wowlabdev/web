"use client";

import { useCallback } from "react";

import { useGlobalStrings } from "@/lib/query/services";

const SCHOOL_TAGS: readonly string[] = [
  "STRING_SCHOOL_PHYSICAL",
  "STRING_SCHOOL_HOLY",
  "STRING_SCHOOL_FIRE",
  "STRING_SCHOOL_NATURE",
  "STRING_SCHOOL_FROST",
  "STRING_SCHOOL_SHADOW",
  "STRING_SCHOOL_ARCANE",
  "STRING_SCHOOL_CHAOS",
];

export function useSchoolNames(): (mask: number) => string {
  const strings = useGlobalStrings(SCHOOL_TAGS);

  return useCallback(
    (mask: number): string => {
      const parts: string[] = [];

      for (const [bit, tag] of SCHOOL_TAGS.entries()) {
        if ((mask & (1 << bit)) !== 0) {
          const name = strings[tag];

          if (name) {
            parts.push(name);
          }
        }
      }

      return parts.length > 0 ? parts.join(" + ") : "--";
    },
    [strings],
  );
}
