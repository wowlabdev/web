"use client";

import type { ItemScalingData, ResolvedItem } from "wowlab-common";

import { useMemo } from "react";

import type { QueryResult } from "@/lib/data/result";
import type { Item } from "@wowlab/shared/lib/supabase/types";

import { toItemDataFlat } from "@/lib/game/item-tooltip";
import { useCommonModule } from "@/lib/query/services/game/engine";
import { resolveItem } from "@/lib/wasm/api";

import { getItemScalingData } from "./item-scaling";
import { useBulkReady } from "./use-bulk";
import { useSortedIds } from "./use-sorted-ids";

export function useItemScaling(
  bonusIds: number[],
): QueryResult<ItemScalingData> {
  const ready = useBulkReady();
  const sorted = useSortedIds(bonusIds);
  const data = useMemo(
    () => (ready ? getItemScalingData(sorted) : undefined),
    [ready, sorted],
  );

  return {
    data,
    error: null,
    isError: false,
    isFetching: !data,
    isLoading: !data,
    notFound: false,
  };
}

// Empty bonusIds resolves the base item.
export function useResolvedItem(
  item: Item | undefined,
  bonusIds: number[],
): QueryResult<ResolvedItem> {
  const sorted = useSortedIds(bonusIds);
  const { data: common } = useCommonModule();
  const { data: scalingData } = useItemScaling(sorted);

  const data = useMemo(() => {
    if (!item || !common || !scalingData) {
      return;
    }

    return resolveItem(common, toItemDataFlat(item), sorted, scalingData);
  }, [common, item, scalingData, sorted]);

  return {
    data,
    error: null,
    isError: false,
    isFetching: !data,
    isLoading: !data,
    notFound: false,
  };
}
