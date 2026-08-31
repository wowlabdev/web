import { useQuery } from "@tanstack/react-query";

import type { QueryListResult, QueryResult } from "@/lib/data/result";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult, toQueryResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { throwIfError } from "../shared";

export const ROTATIONS_KEY = ["rotations"] as const;

export const ROTATIONS_ALL_KEY = [...ROTATIONS_KEY, "all"] as const;

export const ROTATIONS_IMPORTABLE_KEY = [
  ...ROTATIONS_KEY,
  "importable",
] as const;

export const ROTATIONS_ONE_KEY = [...ROTATIONS_KEY, "one"] as const;

export function useAllRotations(): QueryListResult<Row<"rotations">> {
  return toQueryListResult(
    useQuery({
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("rotations")
          .select("*")
          .eq("is_public", true)
          .order("updated_at", { ascending: false });

        throwIfError(error);

        return data as Row<"rotations">[];
      },
      queryKey: ROTATIONS_ALL_KEY,
    }),
  );
}

export function useImportableRotations(
  specId: number,
  userId?: string,
): QueryListResult<Row<"rotations">> {
  return toQueryListResult(
    useQuery({
      enabled: specId > 0,
      queryFn: async () => {
        const supabase = createClient();
        const base = supabase
          .from("rotations")
          .select("*")
          .eq("spec_id", specId);
        const scoped = userId
          ? base.or(`is_public.eq.true,user_id.eq.${userId}`)
          : base.eq("is_public", true);
        const { data, error } = await scoped.order("updated_at", {
          ascending: false,
        });

        throwIfError(error);

        return data as Row<"rotations">[];
      },
      queryKey: [...ROTATIONS_IMPORTABLE_KEY, specId, userId ?? "anon"],
    }),
  );
}

export function useRotation(id: string): QueryResult<Row<"rotations">> {
  return toQueryResult(
    useQuery({
      enabled: id.length > 0,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("rotations")
          .select("*")
          .eq("id", id)
          .single();

        throwIfError(error);

        return data as Row<"rotations">;
      },
      queryKey: [...ROTATIONS_ONE_KEY, id],
    }),
  );
}

export function useRotations(
  specId: number,
): QueryListResult<Row<"rotations">> {
  return toQueryListResult(
    useQuery({
      enabled: specId > 0,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("rotations")
          .select("*")
          .eq("spec_id", specId);

        throwIfError(error);

        return data as Row<"rotations">[];
      },
      queryKey: [...ROTATIONS_KEY, specId],
    }),
  );
}
