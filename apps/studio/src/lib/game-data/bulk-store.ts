import type { Database } from "@wowlab/shared/lib/supabase/database.types";
import type { GameRow } from "@wowlab/shared/lib/supabase/types";

import {
  BULK_TABLES,
  type BulkTableName,
} from "@wowlab/shared/lib/game-data/bulk-tables.generated";

import type { GameDb } from "./store";

export type BulkRow<Name extends BulkTableName = BulkTableName> =
  Name extends GameTableName
    ? Omit<GameRow<Name>, "patch_version" | "updated_at">
    : never;

type GameTableName = keyof Database["game"]["Tables"];

const LOCAL_PREFIX = "bulk:";

let tables: Map<BulkTableName, BulkRow[]> | null = null;

let ready = false;

const uniqueIndexCache = new Map<string, Map<unknown, BulkRow>>();

const groupIndexCache = new Map<string, Map<unknown, BulkRow[]>>();

const listeners = new Set<() => void>();

let readyWaiters: (() => void)[] = [];

export function getBulkRows<Name extends BulkTableName>(
  name: Name,
): BulkRow<Name>[] {
  return (tables?.get(name) ?? []) as BulkRow<Name>[];
}

export function groupBulkBy<
  Name extends BulkTableName,
  Field extends Extract<keyof BulkRow<Name>, string>,
>(name: Name, field: Field): Map<BulkRow<Name>[Field], BulkRow<Name>[]> {
  const cacheKey = `${name}:${field}`;
  const cached = groupIndexCache.get(cacheKey);

  if (cached) {
    return cached as Map<BulkRow<Name>[Field], BulkRow<Name>[]>;
  }

  const index = new Map<BulkRow<Name>[Field], BulkRow<Name>[]>();

  for (const row of getBulkRows(name)) {
    const key = row[field];
    const bucket = index.get(key);

    if (bucket) {
      bucket.push(row);
    } else {
      index.set(key, [row]);
    }
  }

  groupIndexCache.set(cacheKey, index as Map<unknown, BulkRow[]>);

  return index;
}

export function indexBulkBy<
  Name extends BulkTableName,
  Field extends Extract<keyof BulkRow<Name>, string>,
>(name: Name, field: Field): Map<BulkRow<Name>[Field], BulkRow<Name>> {
  const cacheKey = `${name}:${field}`;
  const cached = uniqueIndexCache.get(cacheKey);

  if (cached) {
    return cached as Map<BulkRow<Name>[Field], BulkRow<Name>>;
  }

  const index = new Map<BulkRow<Name>[Field], BulkRow<Name>>();

  for (const row of getBulkRows(name)) {
    index.set(row[field], row);
  }

  uniqueIndexCache.set(cacheKey, index as Map<unknown, BulkRow>);

  return index;
}

export function isBulkReady(): boolean {
  return ready;
}

export async function loadBulkTables(gameDb: GameDb): Promise<boolean> {
  const next = new Map<BulkTableName, BulkRow[]>();

  for (const table of BULK_TABLES) {
    const doc = await gameDb.getLocal(`${LOCAL_PREFIX}${table.name}`);
    const rows = doc?.get("rows") as BulkRow[] | undefined;

    if (!rows) {
      return false;
    }

    next.set(table.name, rows);
  }

  tables = next;
  ready = true;
  emit();

  return true;
}

export function parseBulkRows<Name extends BulkTableName>(
  name: Name,
  values: unknown[],
): BulkRow<Name>[] {
  const table = BULK_TABLES.find((entry) => entry.name === name);

  if (!table) {
    throw new Error(`Unknown bulk table: ${name}`);
  }

  return values.map((value, index) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`${name}[${index}] is not an object`);
    }

    for (const key of table.key) {
      if (!(key in value)) {
        throw new Error(`${name}[${index}] is missing key ${key}`);
      }
    }

    return value as BulkRow<Name>;
  });
}

export function publishBulkTables(): void {
  ready = true;
  emit();
}

export function resetBulkMemory(): void {
  tables = null;
  ready = false;
  emit();
}

export async function storeBulkTable(
  gameDb: GameDb,
  name: BulkTableName,
  rows: BulkRow[],
): Promise<void> {
  await gameDb.upsertLocal(`${LOCAL_PREFIX}${name}`, { rows });

  if (tables === null) {
    tables = new Map();
  }

  tables.set(name, rows);
}

export function subscribeBulk(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function whenBulkReady(): Promise<void> {
  if (isBulkReady()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    readyWaiters.push(resolve);
  });
}

function emit(): void {
  uniqueIndexCache.clear();
  groupIndexCache.clear();

  if (ready && readyWaiters.length > 0) {
    const waiters = readyWaiters;

    readyWaiters = [];

    for (const resolve of waiters) {
      resolve();
    }
  }

  for (const listener of listeners) {
    listener();
  }
}
