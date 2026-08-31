"use client";

import type { Profile } from "wowlab-common";

import { useCreation } from "ahooks";

import { useCommon } from "@/components/shared/wasm";
import { usePaperdolls } from "@/lib/query/services";
import { type PaperdollRow } from "@/lib/query/services/admin/paperdolls";
import { parseSimcProfile } from "@/lib/wasm/api";

export function useSpecPaperdollProfile(specId: number | null): {
  profile: Profile | null;
  row: PaperdollRow | null;
} {
  const common = useCommon();
  const { data: paperdolls } = usePaperdolls();
  const row = useCreation(
    () => paperdolls?.find((p) => p.spec_id === specId) ?? null,
    [paperdolls, specId],
  );
  const profile = useCreation(() => {
    if (!row) {
      return null;
    }

    try {
      return parseSimcProfile(common, row.simc);
    } catch {
      return null;
    }
  }, [common, row]);

  return { profile, row };
}
