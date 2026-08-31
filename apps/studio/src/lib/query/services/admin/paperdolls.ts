"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryListResult } from "@/lib/data/result";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { type RpcArgs, throwIfError } from "../shared";
import { PAPERDOLLS_KEY } from "./keys";

export type PaperdollRow = Row<"paperdolls">;

type DeletePaperdollInput = RpcArgs<"admin_delete_paperdoll">["p_spec_id"];

type UpsertPaperdollInput = {
  p_character_name: RpcArgs<"admin_upsert_paperdoll">["p_character_name"];
  p_simc: RpcArgs<"admin_upsert_paperdoll">["p_simc"];
  p_spec_id: RpcArgs<"admin_upsert_paperdoll">["p_spec_id"];
};

export function useDeletePaperdoll() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeletePaperdollInput>({
    mutationFn: async (specId) => {
      const supabase = createClient();
      const { error } = await supabase.rpc("admin_delete_paperdoll", {
        p_spec_id: specId,
      });

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAPERDOLLS_KEY });
    },
  });
}

export function usePaperdolls(): QueryListResult<PaperdollRow> {
  return toQueryListResult(
    useQuery<PaperdollRow[]>({
      queryFn: async (): Promise<PaperdollRow[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("paperdolls")
          .select("*")
          .order("spec_id");

        throwIfError(error);

        return data ?? [];
      },
      queryKey: PAPERDOLLS_KEY,
    }),
  );
}

export function useUpsertPaperdoll() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpsertPaperdollInput>({
    mutationFn: async ({ p_character_name, p_simc, p_spec_id }) => {
      const supabase = createClient();
      const { error } = await supabase.rpc("admin_upsert_paperdoll", {
        p_character_name,
        p_simc,
        p_spec_id,
      });

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAPERDOLLS_KEY });
    },
  });
}
