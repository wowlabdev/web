"use client";

import type { QueryListResult, QueryResult } from "@/lib/data/result";
import type { Item, ItemSummary } from "@wowlab/shared/lib/supabase/types";

import { ensureItemFull, ensureItemsDisplay, ensureItemsFull } from "./display";
import {
  useDisplayRow,
  useDisplayRows,
  useFullEntities,
  useFullEntity,
} from "./entity-hooks";

export function useItem(itemId: number): QueryResult<Item> {
  return useFullEntity("items_full", ensureItemFull, "Item", itemId);
}

export function useItems(ids: number[]): QueryListResult<Item> {
  return useFullEntities("items_full", ensureItemsFull, "Item", ids);
}

export function useItemSummaries(ids: number[]): QueryListResult<ItemSummary> {
  return useDisplayRows(
    "items_display",
    ensureItemsDisplay,
    "Item display",
    ids,
  );
}

export function useItemSummary(itemId: number): QueryResult<ItemSummary> {
  return useDisplayRow(
    "items_display",
    ensureItemsDisplay,
    "Item display",
    itemId,
  );
}
