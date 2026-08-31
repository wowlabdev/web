"use client";

import type { Profile } from "wowlab-common";

import { useCreation } from "ahooks";

import { useCommon } from "@/components/shared/wasm";
import { parseSimcProfile } from "@/lib/wasm/api";

export function useSimcProfile(
  simc: string | null | undefined,
): Profile | null {
  const common = useCommon();

  return useCreation(() => {
    if (!simc) {
      return null;
    }

    try {
      return parseSimcProfile(common, simc);
    } catch {
      return null;
    }
  }, [common, simc]);
}
