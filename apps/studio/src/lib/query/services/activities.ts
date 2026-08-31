import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryResult } from "@/lib/data/result";

import { toQueryResult } from "@/lib/data/result";
import { type ActivityItem, ActivityItemsSchema, parse } from "@/lib/zod";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { throwIfError } from "./shared";
import { useUserId } from "./user";

const ACTIVITIES_KEY = ["activities"] as const;

type ActivitiesResult = { items: ActivityItem[]; seen_at: string };

const EMPTY_ACTIVITY: ActivitiesResult = {
  items: [],
  seen_at: "1970-01-01T00:00:00Z",
};

export function useActivities(): QueryResult<ActivitiesResult> {
  const userId = useUserId();

  return toQueryResult(
    useQuery<ActivitiesResult>({
      enabled: !!userId,
      queryFn: async () => {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("user_activities")
          .select("items, seen_at")
          .maybeSingle();

        throwIfError(error);

        if (!data) {
          return EMPTY_ACTIVITY;
        }

        return {
          items: parse(ActivityItemsSchema, data.items, []),
          seen_at: data.seen_at as string,
        };
      },
      queryKey: [...ACTIVITIES_KEY, userId],
    }),
  );
}

export function useMarkActivitySeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.rpc("mark_activity_seen");

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEY });
    },
  });
}
