import * as Comlink from "comlink";

import { log } from "@/lib/observability";

import type {
  NodeKeypair,
  WorkerChunkPayload,
  WorkerEnv,
  WorkerMetricsHandler,
  WorkerProgressHandler,
  WorkerRunResult,
} from "./worker-contract";
import type { PendingTask, WorkerSlot } from "./worker-slot";
import type { WatchdogTimeoutSnapshot } from "./worker-watchdog";

import { describeExecutionError } from "./worker-diagnostics";
import { runTaskOnWorker } from "./worker-manager-dispatch";
import {
  buildSlotErrorMetrics,
  buildTerminatedSlotMetrics,
  collectSlotMetrics,
} from "./worker-manager-metrics";
import { createWorkerPoolSlots, initWorkerPool } from "./worker-manager-pool";
import { createWorkerMetrics, type WorkerMetrics } from "./worker-metrics";
import {
  buildAggregateMetrics,
  sanitizeWorkerMetrics,
} from "./worker-metrics-aggregate";
import { formatWatchdogTimeoutDetail } from "./worker-slot";

const DEFAULT_WATCHDOG_MS = 120_000;
const DEFAULT_MAX_WORKERS = 8;
const DEFAULT_POOL_SIZE = 4;

export class WorkerManager {
  private _onFatalError: ((message: string) => void) | null = null;
  private _onMetrics: WorkerMetricsHandler | null = null;
  private activeWorkerLimit: number;
  private booted = false;
  private commonWasmBytes: ArrayBuffer | null = null;
  private engineWasmBytes: ArrayBuffer | null = null;
  private lastMetrics: WorkerMetrics = createWorkerMetrics();
  private maxWorkers: number;
  private pending: PendingTask[] = [];
  private watchdogMs: number;
  private workers: WorkerSlot[] = [];

  constructor(opts?: {
    defaultPoolSize?: number;
    maxWorkers?: number;
    watchdogMs?: number;
  }) {
    this.watchdogMs = opts?.watchdogMs ?? DEFAULT_WATCHDOG_MS;
    this.maxWorkers = opts?.maxWorkers ?? DEFAULT_MAX_WORKERS;
    this.activeWorkerLimit = opts?.defaultPoolSize ?? DEFAULT_POOL_SIZE;
  }

  get isReady(): boolean {
    return this.workers.length > 0;
  }

  get poolSize(): number {
    return this.activeWorkerLimit;
  }

  get workerCount(): number {
    return this.workers.length;
  }

  set onFatalError(cb: ((message: string) => void) | null) {
    this._onFatalError = cb;
  }

  set onMetrics(cb: WorkerMetricsHandler | null) {
    this._onMetrics = cb;
  }

  async boot(engineWasm: ArrayBuffer, commonWasm: ArrayBuffer): Promise<void> {
    this.engineWasmBytes = engineWasm.slice(0);
    this.commonWasmBytes = commonWasm.slice(0);
    this.booted = true;
    await this.spawnAndInit(engineWasm, commonWasm);
  }

  cancel(): void {
    this.kill();
  }

  dispose(): void {
    this.kill(new Error("WorkerManager disposed"));
    this._onMetrics = null;
    this._onFatalError = null;
    this.engineWasmBytes = null;
    this.commonWasmBytes = null;
    this.booted = false;
  }

  async getMetrics(): Promise<WorkerMetrics> {
    if (this.workers.length === 0) {
      return createWorkerMetrics();
    }

    return this.aggregate(await collectSlotMetrics(this.workers));
  }

  kill(reason: Error = new Error("WorkerManager terminated")): void {
    for (const task of this.pending) {
      task.reject(reason);
    }

    this.pending = [];

    const terminated: WorkerMetrics[] = [];

    for (const slot of this.workers) {
      slot.watchdog.finish();

      if (slot.activeTask) {
        slot.activeTask.reject(reason);
        slot.activeTask = null;
      }

      slot.isBusy = false;
      slot.api[Comlink.releaseProxy]();
      slot.worker.terminate();
      slot.lastMetrics = buildTerminatedSlotMetrics(slot);
      terminated.push(slot.lastMetrics);
    }

    this.workers = [];

    this.emitMetrics(
      createWorkerMetrics({
        state: "terminated",
        workerId: "pool",
        workers: terminated,
      }),
    );
  }

  async reprimeIfBooted(): Promise<void> {
    if (this.booted && this.engineWasmBytes && this.commonWasmBytes) {
      await this.restart();
    }
  }

  async restart(): Promise<void> {
    this.kill(new Error("WorkerManager restarting"));

    if (!this.booted || !this.engineWasmBytes || !this.commonWasmBytes) {
      throw new Error("WorkerManager: not booted. Call boot() first.");
    }

    await this.spawnAndInit(
      this.engineWasmBytes.slice(0),
      this.commonWasmBytes.slice(0),
    );
  }

  async runChunk(
    chunk: WorkerChunkPayload,
    keypair: NodeKeypair,
    env: WorkerEnv,
    onProgress?: WorkerProgressHandler,
  ): Promise<WorkerRunResult> {
    if (this.workers.length === 0) {
      throw new Error("WorkerManager: not booted. Call boot() first.");
    }

    return new Promise<WorkerRunResult>((resolve, reject) => {
      this.pending.push({ chunk, env, keypair, onProgress, reject, resolve });
      this.drainQueue();
    });
  }

  setPoolSize(size: number): void {
    const next = Math.max(
      1,
      Math.min(Math.floor(size), this.workers.length || 1),
    );

    this.activeWorkerLimit = next;
    this.emitAggregate();
    this.drainQueue();
  }

  setWorkerEnabled(workerId: string, enabled: boolean): void {
    const slot = this.workers.find((worker) => worker.id === workerId);

    if (!slot) {
      return;
    }

    slot.isEnabled = enabled;
    this.emitAggregate();
    this.drainQueue();
  }

  private aggregate(perWorker: WorkerMetrics[]): WorkerMetrics {
    return buildAggregateMetrics(perWorker, this.activeWorkerLimit);
  }

  private drainQueue(): void {
    let capacity = Math.max(
      0,
      this.activeWorkerLimit -
        this.workers.filter((slot) => slot.isBusy).length,
    );

    if (capacity === 0) {
      return;
    }

    for (const slot of this.workers) {
      if (capacity === 0) {
        return;
      }

      if (slot.isBusy || !slot.isEnabled) {
        continue;
      }

      const task = this.pending.shift();

      if (!task) {
        return;
      }

      capacity -= 1;
      void runTaskOnWorker(slot, task, {
        drainQueue: () => this.drainQueue(),
        ingestWorkerMetrics: (s, metrics) =>
          this.ingestWorkerMetrics(s, metrics),
        onWatchdogTimeout: (s, snapshot) =>
          this.handleWatchdogTimeout(s, snapshot),
      });
    }
  }

  private emitAggregate(): void {
    this.emitMetrics(
      this.aggregate(this.workers.map((slot) => slot.lastMetrics)),
    );
  }

  private emitMetrics(metrics: WorkerMetrics): void {
    this.lastMetrics = metrics;
    this._onMetrics?.(metrics);
  }

  private handleFatal(message: string, cause?: unknown): void {
    const detail = cause
      ? `${message} | detail=${describeExecutionError(cause)}`
      : message;

    log.withMetadata({ detail }).withError(cause).error("[WorkerManager]");
    this._onFatalError?.(detail);
  }

  private handleWatchdogTimeout(
    slot: WorkerSlot,
    snapshot: WatchdogTimeoutSnapshot,
  ): void {
    const detail = formatWatchdogTimeoutDetail(slot.id, snapshot);

    this.markSlotError(slot);
    this.handleFatal(detail);
    this.restart().catch((error) => {
      log
        .withError(error)
        .error("[WorkerManager] Failed to restart after watchdog:");
    });
  }

  private ingestWorkerMetrics(slot: WorkerSlot, metrics: WorkerMetrics): void {
    slot.lastMetrics = sanitizeWorkerMetrics(slot, metrics);
    this.emitAggregate();
  }

  private markSlotError(slot: WorkerSlot): void {
    slot.lastMetrics = buildSlotErrorMetrics(slot);
    this.emitAggregate();
  }

  private async spawnAndInit(
    engineWasm: ArrayBuffer,
    commonWasm: ArrayBuffer,
  ): Promise<void> {
    this.pending = [];
    this.workers = createWorkerPoolSlots(this.maxWorkers, this.watchdogMs, {
      isTracked: (s) => this.workers.includes(s),
      onFatal: (message, cause) => this.handleFatal(message, cause),
      onSlotError: (s) => this.markSlotError(s),
    });
    this.activeWorkerLimit = Math.max(
      1,
      Math.min(this.activeWorkerLimit, this.workers.length || 1),
    );

    this.emitAggregate();

    await initWorkerPool(
      this.workers,
      engineWasm,
      commonWasm,
      (slot, metrics) => this.ingestWorkerMetrics(slot, metrics),
    );
  }
}
