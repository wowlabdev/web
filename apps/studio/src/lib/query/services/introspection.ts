"use client";

import type { SpecIntrospection } from "wowlab-common";

import { useQuery } from "@tanstack/react-query";

import { toQueryResult } from "@/lib/data/result";
import { resolveSpecIntrospectionOnWorker } from "@/lib/node/resolution-worker-client";
import {
  beginResolveActivity,
  endResolveActivity,
  reportResolveEvent,
} from "@/lib/state/resolve-activity-store";

export const ENGINE_INTRO_RESOLVED_KEY = ["engine", "intro-resolved"] as const;

export function useResolvedSpecIntrospection(specId: null | number) {
  return toQueryResult(
    useQuery({
      enabled: specId != null,
      queryFn: async (): Promise<SpecIntrospection> => {
        if (specId == null) {
          throw new Error("specId required");
        }

        beginResolveActivity();

        try {
          return await resolveSpecIntrospectionOnWorker(
            specId,
            reportResolveEvent,
          );
        } finally {
          endResolveActivity();
        }
      },
      queryKey: [...ENGINE_INTRO_RESOLVED_KEY, specId],
      staleTime: 5 * 60 * 1000,
    }),
  );
}
