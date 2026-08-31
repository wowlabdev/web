import { useQuery } from "@tanstack/react-query";

import type { QueryListResult } from "@/lib/data/result";
import type { SpellSearchResult } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { throwIfError } from "../shared";

export const GAME_SPELLS_SEARCH_KEY = ["game", "spells", "search"] as const;

export function useSpellSearch(
  query: string,
): QueryListResult<SpellSearchResult> {
  return toQueryListResult(
    useQuery({
      enabled: query.length > 2,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .schema("game")
          .from("spells")
          .select("id, name, file_name")
          .ilike("name", `%${query}%`)
          .limit(20);

        throwIfError(error);

        return data as SpellSearchResult[];
      },
      queryKey: [...GAME_SPELLS_SEARCH_KEY, query],
    }),
  );
}
