"use client";

import { useRequest } from "ahooks";

import { getBulkRows, whenBulkReady } from "@/lib/game-data/bulk-store";
import { GAME_COLLECTION_NAMES, getGameDb } from "@/lib/game-data/store";
import { getStoredSyncState } from "@/lib/game-data/sync";
import { BULK_TABLES } from "@wowlab/shared/lib/game-data/bulk-tables.generated";

import type { GameTableName } from "./game-table-source";

export type GameStorageStats = {
  dbName: string;
  idbStoreCount: number | null;
  isLeader: boolean;
  patchVersion: string | null;
  persisted: boolean;
  quota: number | null;
  revision: number | null;
  snapshotBytes: number | null;
  syncedAt: number | null;
  tables: GameTableStat[];
  totalRows: number;
  usage: number | null;
  usageIndexedDb: number | null;
};

export type GameTableGroup = "bulk" | "onDemand";

export type GameTableStat = {
  count: number;
  group: GameTableGroup;
  name: GameTableName;
};

type StorageEstimateWithDetails = {
  usageDetails?: { indexedDB?: number };
} & StorageEstimate;

export function useGameTableStats() {
  return useRequest(readGameTableStats);
}

async function readGameTableStats(): Promise<GameStorageStats> {
  const db = await getGameDb();

  await whenBulkReady();

  const onDemand = await Promise.all(
    GAME_COLLECTION_NAMES.map(async (name) => {
      const count = await db.collections[name].count().exec();

      return { count, group: "onDemand", name } satisfies GameTableStat;
    }),
  );

  const bulk = BULK_TABLES.map(
    (table) =>
      ({
        count: getBulkRows(table.name).length,
        group: "bulk",
        name: table.name,
      }) satisfies GameTableStat,
  );

  const tables = [...onDemand, ...bulk];
  const totalRows = tables.reduce((sum, table) => sum + table.count, 0);
  const estimate = await navigator.storage.estimate().catch(() => null);
  const persisted = await navigator.storage.persisted().catch(() => false);
  const syncState = await getStoredSyncState(db).catch(() => null);
  const idbStoreCount = await readIdbStoreCount(db.name);
  const usageDetails = (estimate as StorageEstimateWithDetails | null)
    ?.usageDetails;

  return {
    dbName: db.name,
    idbStoreCount,
    isLeader: db.isLeader(),
    patchVersion: syncState?.patchVersion ?? null,
    persisted,
    quota: estimate?.quota ?? null,
    revision: syncState?.revision ?? null,
    snapshotBytes: syncState?.snapshotBytes ?? null,
    syncedAt: syncState?.syncedAt ?? null,
    tables: [...tables].sort((a, b) => b.count - a.count),
    totalRows,
    usage: estimate?.usage ?? null,
    usageIndexedDb: usageDetails?.indexedDB ?? null,
  };
}

async function readIdbStoreCount(dbName: string): Promise<number | null> {
  if (typeof indexedDB.databases !== "function") {
    return null;
  }

  const databases = await indexedDB.databases().catch(() => []);

  return databases.filter((entry) => entry.name?.includes(dbName)).length;
}
