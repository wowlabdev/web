import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { renderGlobalString } from "@/lib/wasm/api";
import { getCommon } from "@/lib/wasm/loaders/common";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { throwIfError } from "../shared";

export const GAME_GLOBAL_STRINGS_KEY = ["game", "global-strings"] as const;

type GlobalStringRow = {
  tag: string;
  value: string;
};

export function useGlobalStrings(
  tags: readonly string[],
): Record<string, string> {
  const sorted = useMemo(
    () => [...new Set(tags)].sort((a, b) => a.localeCompare(b)),
    [tags],
  );

  const { data } = useQuery({
    enabled: sorted.length > 0,
    queryFn: async () => {
      const supabase = createClient();
      const { data: rows, error } = await supabase
        .schema("game")
        .from("global_strings")
        .select("tag, value")
        .in("tag", sorted);

      throwIfError(error);

      const common = await getCommon();

      const map: Record<string, string> = {};

      for (const row of rows as GlobalStringRow[]) {
        map[row.tag] = renderGlobalString(common, row.value);
      }

      return map;
    },
    queryKey: [...GAME_GLOBAL_STRINGS_KEY, sorted],
    staleTime: Infinity,
  });

  return useMemo(() => data ?? {}, [data]);
}
