"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryListResult } from "@/lib/data/result";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { type RpcReturns, throwIfError } from "../shared";
import { SHORT_URLS_KEY } from "./keys";

export type ShortUrlRow = Row<"short_urls">;

type ShortUrlResult = NonNullable<RpcReturns<"get_or_create_short_url">>;

export function useGenerateShortUrl() {
  const queryClient = useQueryClient();

  return useMutation<ShortUrlResult, Error, string>({
    mutationFn: async (targetUrl) => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_or_create_short_url", {
        p_target_url: targetUrl,
      });

      throwIfError(error);

      if (!data) {
        throw new Error("get_or_create_short_url returned no value");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHORT_URLS_KEY });
    },
  });
}

export function useShortUrls(): QueryListResult<ShortUrlRow> {
  return toQueryListResult(
    useQuery<ShortUrlRow[]>({
      queryFn: async (): Promise<ShortUrlRow[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("short_urls")
          .select("slug, target_url, created_at")
          .order("created_at", { ascending: false })
          .limit(200);

        throwIfError(error);

        return data ?? [];
      },
      queryKey: SHORT_URLS_KEY,
    }),
  );
}
