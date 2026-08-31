import { env } from "@wowlab/shared/lib/env";
import {
  BULK_TABLES,
  type BulkTableName,
} from "@wowlab/shared/lib/game-data/bulk-tables.generated";

import type { GameSupabase } from "./pg-loader";
import type { GameDb } from "./store";

import {
  loadBulkTables,
  parseBulkRows,
  publishBulkTables,
  storeBulkTable,
} from "./bulk-store";
import { clearItemScalingCache } from "./item-scaling";
import { decodeSnapshot, fetchSnapshot } from "./snapshot-loader";

const SYNC_LOCK_NAME = "game-data-sync";

const SYNC_STATE_KEY = "sync-state";

export const BULK_COLLECTIONS: readonly BulkTableName[] = BULK_TABLES.map(
  (table) => table.name,
);

export const ON_DEMAND_COLLECTIONS = [
  "items_full",
  "items_display",
  "spells_full",
  "spells_display",
  "enchantments",
  "expected_stats",
  "item_damage_scaling",
] as const;

export type GameSyncPhase =
  "checking" | "downloading" | "error" | "idle" | "purging" | "ready";

export type GameSyncState = {
  patchVersion: string | null;
  revision: number;
  snapshotBytes: number;
  syncedAt: number;
};

export type GameSyncStatus = {
  currentStep: GameSyncStep;
  currentTable: string;
  loadedTables: number;
  phase: GameSyncPhase;
  totalTables: number;
};

export type GameSyncStep = "download" | "insert" | "unzip";

export const GAME_SYNC_SERVER_STATUS: GameSyncStatus = {
  currentStep: "download",
  currentTable: "",
  loadedTables: 0,
  phase: "idle",
  totalTables: 0,
};

export const GAME_SYNC_STEP_ORDER: readonly GameSyncStep[] = [
  "download",
  "unzip",
  "insert",
];

export function gameSyncPercent(status: GameSyncStatus): number {
  return status.totalTables > 0
    ? Math.round((status.loadedTables / status.totalTables) * 100)
    : 0;
}

const MAX_SYNC_ATTEMPTS = 3;

const RETRY_DELAY_MS = 1500;

let syncStatus: GameSyncStatus = {
  currentStep: "download",
  currentTable: "",
  loadedTables: 0,
  phase: "idle",
  totalTables: BULK_COLLECTIONS.length,
};

const syncListeners = new Set<() => void>();

export function getGameSyncStatus(): GameSyncStatus {
  return syncStatus;
}

export async function getStoredSyncState(
  gameDb: GameDb,
): Promise<GameSyncState | null> {
  const state = await gameDb.getLocal(SYNC_STATE_KEY);

  if (!state) {
    return null;
  }

  const revision = state.get("revision");

  if (typeof revision !== "number") {
    return null;
  }

  return {
    patchVersion: state.get("patchVersion") ?? null,
    revision,
    snapshotBytes: state.get("snapshotBytes") ?? 0,
    syncedAt: state.get("syncedAt") ?? 0,
  };
}

export function setSyncPurging(): void {
  setSyncStatus({ currentTable: "", loadedTables: 0, phase: "purging" });
}

export function subscribeGameSyncStatus(listener: () => void): () => void {
  syncListeners.add(listener);

  return () => {
    syncListeners.delete(listener);
  };
}

export async function syncGameData(
  gameDb: GameDb,
  supabase: GameSupabase,
): Promise<void> {
  for (let attempt = 1; attempt <= MAX_SYNC_ATTEMPTS; attempt += 1) {
    try {
      setSyncStatus({ phase: "checking" });
      await runSync(gameDb, supabase);
      setSyncStatus({ currentTable: "", phase: "ready" });

      return;
    } catch (error) {
      if (attempt === MAX_SYNC_ATTEMPTS) {
        setSyncStatus({ currentTable: "", phase: "error" });
        throw error;
      }

      setSyncStatus({ currentTable: "", loadedTables: 0, phase: "checking" });
      await delay(RETRY_DELAY_MS);
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isFresh(gameDb: GameDb, revision: number): Promise<boolean> {
  return gameDb
    .getLocal(SYNC_STATE_KEY)
    .then((state) => state?.get("revision") === revision);
}

async function runSync(gameDb: GameDb, supabase: GameSupabase): Promise<void> {
  const { data } = await supabase
    .schema("game")
    .from("meta")
    .select("revision,patch_version")
    .eq("id", 1)
    .maybeSingle()
    .throwOnError();

  if (!data) {
    throw new Error("game data not seeded — run `wowlab snapshot sync`");
  }

  const revision = data.revision;
  const patchVersion = data.patch_version;

  if ((await isFresh(gameDb, revision)) && (await loadBulkTables(gameDb))) {
    return;
  }

  await navigator.locks.request(SYNC_LOCK_NAME, async () => {
    if ((await isFresh(gameDb, revision)) && (await loadBulkTables(gameDb))) {
      return;
    }

    const snapshotBaseUrl = `${env.SUPABASE_URL}/storage/v1/object/public/game-snapshot/${revision}`;

    setSyncStatus({ currentTable: "", loadedTables: 0, phase: "downloading" });

    let snapshotBytes = 0;

    for (const [index, name] of BULK_COLLECTIONS.entries()) {
      setSyncStatus({
        currentStep: "download",
        currentTable: name,
        phase: "downloading",
      });
      const bytes = await fetchSnapshot(snapshotBaseUrl, name);

      snapshotBytes += bytes.byteLength;

      setSyncStatus({ currentStep: "unzip" });
      const rows = parseBulkRows(name, await decodeSnapshot(bytes));

      setSyncStatus({ currentStep: "insert" });
      await storeBulkTable(gameDb, name, rows);

      setSyncStatus({ loadedTables: index + 1 });
    }

    publishBulkTables();

    await Promise.all(
      ON_DEMAND_COLLECTIONS.map((name) =>
        gameDb.collections[name].find().remove(),
      ),
    );

    const state: GameSyncState = {
      patchVersion,
      revision,
      snapshotBytes,
      syncedAt: Date.now(),
    };

    await gameDb.upsertLocal(SYNC_STATE_KEY, state);
    clearItemScalingCache();
  });
}

function setSyncStatus(next: Partial<GameSyncStatus>): void {
  syncStatus = { ...syncStatus, ...next };

  for (const listener of syncListeners) {
    listener();
  }
}
