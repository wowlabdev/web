"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import type { QueryResult } from "@/lib/data/result";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import type { SeasonRow } from "./seasons";

import { throwIfError } from "../shared";
import { OVERVIEW_KEY } from "./keys";

type AdminOverview = {
  activeSeasonId: SeasonRow["season_id"] | null;
  jobs: number;
  reservedHandles: number;
  rotations: number;
  users: number;
};

type UserLookup = Pick<Row<"user_profiles">, "created_at" | "id"> | null;
type UserLookupHandle = Row<"user_profiles">["handle"];

export function useAdminOverview(): QueryResult<AdminOverview> {
  return toQueryResult(
    useQuery<AdminOverview>({
      queryFn: async (): Promise<AdminOverview> => {
        const supabase = createClient();

        const [usersRes, jobsRes, rotationsRes, handlesRes, activeSeasonRes] =
          await Promise.all([
            supabase
              .from("user_profiles")
              .select("id", { count: "exact", head: true }),
            supabase.from("jobs").select("id", { count: "exact", head: true }),
            supabase
              .from("rotations")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("user_reserved_handles")
              .select("handle", { count: "exact", head: true }),
            supabase
              .from("sim_seasons")
              .select("season_id")
              .eq("is_active", true)
              .maybeSingle(),
          ]);

        throwIfError(usersRes.error);
        throwIfError(jobsRes.error);
        throwIfError(rotationsRes.error);
        throwIfError(handlesRes.error);
        throwIfError(activeSeasonRes.error);

        return {
          activeSeasonId: activeSeasonRes.data?.season_id ?? null,
          jobs: jobsRes.count ?? 0,
          reservedHandles: handlesRes.count ?? 0,
          rotations: rotationsRes.count ?? 0,
          users: usersRes.count ?? 0,
        };
      },
      queryKey: OVERVIEW_KEY,
    }),
  );
}

export function useLookupUser() {
  return useMutation<UserLookup, Error, UserLookupHandle>({
    mutationFn: async (handle): Promise<UserLookup> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, created_at")
        .eq("handle", handle)
        .maybeSingle();

      throwIfError(error);

      return data;
    },
  });
}
