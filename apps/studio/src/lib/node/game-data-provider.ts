import { buildBulkBundle, encodeBulkBundle } from "@/lib/game-data/bulk-bundle";
import { getGameDb } from "@/lib/game-data/store";
import { runGameDataSync } from "@/lib/game-data/sync-runner";
import { log } from "@/lib/observability";

let bufferPromise: Promise<ArrayBuffer> | null = null;

export function getBulkBuffer(): Promise<ArrayBuffer> {
  bufferPromise ??= prepareBulkBuffer();

  return bufferPromise;
}

export function primeBulkBuffer(): void {
  void getBulkBuffer().catch((error: unknown) => {
    log.withError(error).error("Bulk buffer preparation failed");
  });
}

export function resetBulkBuffer(): void {
  bufferPromise = null;
}

async function prepareBulkBuffer(): Promise<ArrayBuffer> {
  await runGameDataSync(await getGameDb());

  return encodeBulkBundle(buildBulkBundle());
}
