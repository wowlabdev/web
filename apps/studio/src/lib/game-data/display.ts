import { type RxCollection } from "rxdb";

import type { GameRow } from "@wowlab/shared/lib/supabase/types";

import { log } from "@/lib/observability";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import type {
  GameCollectionDocuments,
  GameDb,
  ItemSummaryDoc,
  SpellSummaryDoc,
} from "./store";

import { type GameSupabase, getByIds, loadSlice } from "./pg-loader";

export const ITEM_DISPLAY_COLUMNS =
  "id, name, file_name, item_level, quality, required_level, class_id, subclass_id, inventory_type, expansion_id, item_set_id";

export const SPELL_DISPLAY_COLUMNS =
  "id, name, description, file_name, cast_time, recovery_time, school_mask, is_passive, labels";

type ItemDisplaySource = Omit<ItemSummaryDoc, "pk">;

type OnDemandCollection =
  "items_display" | "items_full" | "spells_display" | "spells_full";

type SpellDisplaySource = {
  labels: unknown;
} & Omit<SpellSummaryDoc, "labels" | "pk">;

export async function ensureItemFull(
  gameDb: GameDb,
  itemId: number,
): Promise<void> {
  const existing = await gameDb.collections.items_full
    .findOne(String(itemId))
    .exec();

  if (existing) {
    return;
  }

  const rows = await getByIds<GameRow<"items">>(supabase(), "items", [itemId]);
  const row = rows.at(0);

  if (!row) {
    throw new Error(`Item ${itemId} not found`);
  }

  await gameDb.collections.items_full.upsert(toFullItemDoc(row));
}

export async function ensureItemsDisplay(
  gameDb: GameDb,
  ids: number[],
): Promise<void> {
  const missing = await missingIds(gameDb, "items_display", ids);

  if (missing.length === 0) {
    return;
  }

  const rows = await getByIds<ItemDisplaySource>(
    supabase(),
    "items",
    missing,
    ITEM_DISPLAY_COLUMNS,
  );

  await bulkUpsert(
    gameDb.collections.items_display,
    "items_display",
    rows.map((row) => toDisplayItemDoc(row)),
  );
}

export async function ensureItemsFull(
  gameDb: GameDb,
  ids: number[],
): Promise<void> {
  const missing = await missingIds(gameDb, "items_full", ids);

  if (missing.length === 0) {
    return;
  }

  const rows = await getByIds<GameRow<"items">>(supabase(), "items", missing);

  await bulkUpsert(
    gameDb.collections.items_full,
    "items_full",
    rows.map((row) => toFullItemDoc(row)),
  );
}

export async function ensureSpellFull(
  gameDb: GameDb,
  spellId: number,
): Promise<void> {
  const existing = await gameDb.collections.spells_full
    .findOne(String(spellId))
    .exec();

  if (existing) {
    return;
  }

  const rows = await getByIds<GameRow<"spells">>(supabase(), "spells", [
    spellId,
  ]);
  const row = rows.at(0);

  if (!row) {
    throw new Error(`Spell ${spellId} not found`);
  }

  await gameDb.collections.spells_full.upsert(toFullSpellDoc(row));
}

export async function ensureSpellsDisplay(
  gameDb: GameDb,
  ids: number[],
): Promise<void> {
  const missing = await missingIds(gameDb, "spells_display", ids);

  if (missing.length === 0) {
    return;
  }

  const rows = await getByIds<SpellDisplaySource>(
    supabase(),
    "spells",
    missing,
    SPELL_DISPLAY_COLUMNS,
  );

  await bulkUpsert(
    gameDb.collections.spells_display,
    "spells_display",
    rows.map((row) => toDisplaySpellDoc(row)),
  );
}

export async function ensureSpellsFull(
  gameDb: GameDb,
  ids: number[],
): Promise<void> {
  const missing = await missingIds(gameDb, "spells_full", ids);

  if (missing.length === 0) {
    return;
  }

  const rows = await getByIds<GameRow<"spells">>(supabase(), "spells", missing);

  await bulkUpsert(
    gameDb.collections.spells_full,
    "spells_full",
    rows.map((row) => toFullSpellDoc(row)),
  );
}

export async function loadItemExpansionSlice(
  gameDb: GameDb,
  expansionId: number,
): Promise<void> {
  const rows = await loadSlice<ItemDisplaySource>(
    supabase(),
    "items",
    (q) => q.gt("inventory_type", 0).eq("expansion_id", expansionId),
    ITEM_DISPLAY_COLUMNS,
  );

  await bulkUpsert(
    gameDb.collections.items_display,
    "items_display",
    rows.map((row) => toDisplayItemDoc(row)),
  );
}

async function bulkUpsert<T extends { pk: string }>(
  collection: RxCollection<T>,
  label: string,
  docs: T[],
): Promise<void> {
  const result = await collection.bulkUpsert(docs);

  if (result.error.length > 0) {
    log.error(`${label} bulkUpsert: ${result.error.length} write error(s)`);
  }
}

async function missingIds(
  gameDb: GameDb,
  collection: OnDemandCollection,
  ids: number[],
): Promise<number[]> {
  const found = await gameDb.collections[collection]
    .findByIds(ids.map(String))
    .exec();

  return ids.filter((id) => !found.has(String(id)));
}

function supabase(): GameSupabase {
  return createClient();
}

function toDisplayItemDoc(row: ItemDisplaySource): ItemSummaryDoc {
  return { ...row, pk: String(row.id) };
}

function toDisplaySpellDoc(row: SpellDisplaySource): SpellSummaryDoc {
  const labels = Array.isArray(row.labels) ? (row.labels as number[]) : [];

  return { ...row, labels, pk: String(row.id) };
}

function toFullItemDoc(
  row: GameRow<"items">,
): GameCollectionDocuments["items_full"] {
  return { ...row, pk: String(row.id) };
}

function toFullSpellDoc(
  row: GameRow<"spells">,
): GameCollectionDocuments["spells_full"] {
  return { ...row, labels: row.labels ?? [], pk: String(row.id) };
}
