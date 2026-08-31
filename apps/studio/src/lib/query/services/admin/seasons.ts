"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryListResult } from "@/lib/data/result";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { type RpcArgs, type RpcReturns, throwIfError } from "../shared";
import { OVERVIEW_KEY, SEASONS_KEY } from "./keys";

export type SeasonRow = Row<"sim_seasons">;

type SeasonRolloverInput = {
  endsAt?: NonNullable<RpcArgs<"season_rollover">["p_ends_at"]>;
  newSeasonId: RpcArgs<"season_rollover">["p_new_season_id"];
  rulesetVersion: RpcArgs<"season_rollover">["p_ruleset_version"];
  startsAt: RpcArgs<"season_rollover">["p_starts_at"];
};
type SeasonRolloverResult = NonNullable<RpcReturns<"season_rollover">>;

export function useSeasonRollover() {
  const queryClient = useQueryClient();

  return useMutation<SeasonRolloverResult, Error, SeasonRolloverInput>({
    mutationFn: async ({ endsAt, newSeasonId, rulesetVersion, startsAt }) => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("season_rollover", {
        p_ends_at: endsAt,
        p_new_season_id: newSeasonId,
        p_ruleset_version: rulesetVersion,
        p_starts_at: startsAt,
      });

      throwIfError(error);

      return data ?? [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERVIEW_KEY });
      queryClient.invalidateQueries({ queryKey: SEASONS_KEY });
    },
  });
}

export function useSeasons(): QueryListResult<SeasonRow> {
  return toQueryListResult(
    useQuery<SeasonRow[]>({
      queryFn: async (): Promise<SeasonRow[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("sim_seasons")
          .select(
            "season_id, ruleset_version, starts_at, ends_at, is_active, created_at",
          )
          .order("starts_at", { ascending: false });

        throwIfError(error);

        return data ?? [];
      },
      queryKey: SEASONS_KEY,
    }),
  );
}
