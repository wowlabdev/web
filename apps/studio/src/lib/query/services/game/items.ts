import { useQuery } from "@tanstack/react-query";

import type { QueryListResult } from "@/lib/data/result";
import type { ItemSearchResult } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { throwIfError } from "../shared";

export const GAME_ITEMS_SEARCH_KEY = ["game", "items", "search"] as const;

export function useItemSearch(
  query: string,
): QueryListResult<ItemSearchResult> {
  return toQueryListResult(
    useQuery({
      enabled: query.length > 2,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .schema("game")
          .from("items")
          .select("id, name, item_level, quality, file_name")
          .ilike("name", `%${query}%`)
          .limit(20);

        throwIfError(error);

        return data as ItemSearchResult[];
      },
      queryKey: [...GAME_ITEMS_SEARCH_KEY, query],
    }),
  );
}
