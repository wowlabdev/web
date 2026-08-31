import * as Comlink from "comlink";

import {
  beginResolveActivity,
  endResolveActivity,
  reportResolveEvent,
} from "@/lib/state/resolve-activity-store";

import type { WorkerChunkPayload } from "./worker-contract";
import type { PendingTask, WorkerSlot } from "./worker-slot";
import type { WatchdogTimeoutSnapshot } from "./worker-watchdog";

import { describeExecutionError } from "./worker-diagnostics";
import { type WorkerMetrics } from "./worker-metrics";

export type DispatchDeps = {
  drainQueue: () => void;
  ingestWorkerMetrics: (slot: WorkerSlot, metrics: WorkerMetrics) => void;
  onWatchdogTimeout: (
    slot: WorkerSlot,
    snapshot: WatchdogTimeoutSnapshot,
  ) => void;
};

export function beginWatchdog(
  slot: WorkerSlot,
  chunk: WorkerChunkPayload,
  onTimeout: (slot: WorkerSlot, snapshot: WatchdogTimeoutSnapshot) => void,
): void {
  slot.watchdog.start(
    {
      chunkIndex: chunk.chunkIndex,
      iterations: chunk.iterations,
      jobId: chunk.jobId,
    },
    (snapshot) => onTimeout(slot, snapshot),
  );
}

export async function runTaskOnWorker(
  slot: WorkerSlot,
  task: PendingTask,
  deps: DispatchDeps,
): Promise<void> {
  slot.isBusy = true;
  slot.activeTask = task;
  beginWatchdog(slot, task.chunk, deps.onWatchdogTimeout);

  const onProgressWithHeartbeat = task.onProgress
    ? Comlink.proxy((message: string) => {
        slot.watchdog.beat("progress");
        task.onProgress?.(`[${slot.id}] ${message}`);
      })
    : undefined;

  const onMetricsWithHeartbeat = Comlink.proxy((metrics: WorkerMetrics) => {
    slot.watchdog.beat("metrics");
    deps.ingestWorkerMetrics(slot, metrics);
  });

  const onResolveActivity = Comlink.proxy(reportResolveEvent);

  beginResolveActivity();

  try {
    const result = await slot.api.runChunk(
      task.chunk,
      task.keypair,
      task.env,
      onProgressWithHeartbeat,
      onMetricsWithHeartbeat,
      onResolveActivity,
    );

    task.resolve(result);
  } catch (error) {
    task.reject(new Error(describeExecutionError(error), { cause: error }));
  } finally {
    endResolveActivity();
    slot.watchdog.finish();
    slot.activeTask = null;
    slot.isBusy = false;
    deps.drainQueue();
  }
}
