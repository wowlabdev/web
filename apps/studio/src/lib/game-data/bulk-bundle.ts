import { z } from "zod";

import { BULK_TABLES } from "@wowlab/shared/lib/game-data/bulk-tables.generated";

import { getBulkRows } from "./bulk-store";

export type BulkBundle = Record<string, GameRow[]>;

export type GameRow = Record<string, unknown>;

const BulkBundleSchema = z.record(
  z.string(),
  z.array(z.record(z.string(), z.unknown())),
);

export function buildBulkBundle(): BulkBundle {
  const bundle: BulkBundle = {};

  for (const table of BULK_TABLES) {
    bundle[table.name] = getBulkRows(table.name);
  }

  return bundle;
}

export function decodeBulkBundle(buffer: ArrayBuffer): BulkBundle {
  return BulkBundleSchema.parse(
    JSON.parse(new TextDecoder().decode(buffer)) as unknown,
  );
}

export function encodeBulkBundle(bundle: BulkBundle): ArrayBuffer {
  const bytes = new TextEncoder().encode(JSON.stringify(bundle));

  return bytes.buffer as ArrayBuffer;
}
