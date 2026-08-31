"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryListResult } from "@/lib/data/result";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { type RpcArgs, type RpcReturns, throwIfError } from "../shared";
import { OVERVIEW_KEY, RESERVED_HANDLES_KEY } from "./keys";

export type ReservedHandleRow = Row<"user_reserved_handles">;
type AddReservedHandleInput = {
  handle: RpcArgs<"admin_add_reserved_handle">["p_handle"];
  reason: RpcArgs<"admin_add_reserved_handle">["p_reason"];
};

type DeleteReservedHandleInput =
  RpcArgs<"admin_delete_reserved_handle">["p_handle"];

type ReservedHandlesList = NonNullable<
  RpcReturns<"admin_list_reserved_handles">
>;

export function useAddReservedHandle() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddReservedHandleInput>({
    mutationFn: async ({ handle, reason }) => {
      const supabase = createClient();
      const { error } = await supabase.rpc("admin_add_reserved_handle", {
        p_handle: handle,
        p_reason: reason,
      });

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERVIEW_KEY });
      queryClient.invalidateQueries({ queryKey: RESERVED_HANDLES_KEY });
    },
  });
}

export function useDeleteReservedHandle() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteReservedHandleInput>({
    mutationFn: async (handle) => {
      const supabase = createClient();
      const { error } = await supabase.rpc("admin_delete_reserved_handle", {
        p_handle: handle,
      });

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERVIEW_KEY });
      queryClient.invalidateQueries({ queryKey: RESERVED_HANDLES_KEY });
    },
  });
}

export function useRecentReservedHandles(
  limit = 8,
): QueryListResult<ReservedHandleRow> {
  return toQueryListResult(
    useQuery<ReservedHandleRow[]>({
      queryFn: async (): Promise<ReservedHandleRow[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("user_reserved_handles")
          .select("handle, reason, created_at")
          .order("created_at", { ascending: false })
          .limit(limit);

        throwIfError(error);

        return data ?? [];
      },
      queryKey: [...RESERVED_HANDLES_KEY, "recent", limit],
    }),
  );
}

export function useReservedHandles(): QueryListResult<
  ReservedHandlesList[number]
> {
  return toQueryListResult(
    useQuery<ReservedHandlesList>({
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase.rpc(
          "admin_list_reserved_handles",
        );

        throwIfError(error);

        return data ?? [];
      },
      queryKey: RESERVED_HANDLES_KEY,
    }),
  );
}
