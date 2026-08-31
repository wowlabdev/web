import * as Comlink from "comlink";
import * as commonMod from "wowlab-common";
import * as engineMod from "wowlab-engine";

import { getGameDbLocal } from "@/lib/game-data/store";

import type { WorkerStore } from "./resolver-types";
import type {
  NodeKeypair,
  ResolveEventHandler,
  WorkerChunkPayload,
  WorkerEnv,
  WorkerMetricsHandler,
  WorkerProgressHandler,
  WorkerRunResult,
} from "./worker-contract";

import { createResolver } from "./resolver";
import { createWorkerSupabaseClient } from "./resolver-client";
import { hydrateWorkerStore } from "./resolver-store";
import { installWorkerDiagnostics } from "./sim-worker-diagnostics";
import { normalizeProtobufBytes } from "./sim-worker-protobuf";
import {
  createWorkerMetrics,
  type WorkerMetrics,
  type WorkerPhase,
} from "./worker-metrics";

installWorkerDiagnostics();

let commonReady = false;
let engineMemory: WebAssembly.Memory | null = null;
let engineReady = false;
let storePromise: Promise<WorkerStore> | null = null;
let bulkBuffer: ArrayBuffer | undefined;

const counters = {
  cacheHits: 0,
  cacheMisses: 0,
  chunksCompleted: 0,
  chunksFailed: 0,
  lastChunkMs: 0,
  lastPayloadBytes: 0,
  liveCompleted: 0,
  liveSimsPerSec: 0,
  liveTotal: 0,
  totalIterations: 0,
  totalSimTimeMs: 0,
  wasmInitMs: 0,
};

const spawnedAt = performance.now();
const workerId = crypto.randomUUID().slice(0, 8);

type ChunkContext = {
  chunkIndex: number;
  iterations: number;
  jobId: string;
  startedAt: number;
};

function buildMetrics(
  state: WorkerMetrics["state"],
  phase?: WorkerPhase,
  chunk?: ChunkContext,
): WorkerMetrics {
  const now = performance.now();

  return createWorkerMetrics({
    avgSimsPerSec:
      counters.totalSimTimeMs > 0
        ? counters.totalIterations / (counters.totalSimTimeMs / 1000)
        : 0,
    cacheHits: counters.cacheHits,
    cacheMisses: counters.cacheMisses,
    chunkElapsedMs: chunk ? now - chunk.startedAt : undefined,
    chunksCompleted: counters.chunksCompleted,
    chunksFailed: counters.chunksFailed,
    currentChunkIndex: chunk?.chunkIndex,
    currentIterations: chunk?.iterations,
    currentJobId: chunk?.jobId,
    currentPhase: phase,
    lastChunkMs: counters.lastChunkMs,
    lastPayloadBytes: counters.lastPayloadBytes,
    liveCompleted: counters.liveCompleted,
    liveSimsPerSec: counters.liveSimsPerSec,
    liveTotal: counters.liveTotal,
    state,
    totalIterations: counters.totalIterations,
    totalSimTimeMs: counters.totalSimTimeMs,
    uptimeMs: now - spawnedAt,
    wasmHeapBytes: getWasmHeapBytes(),
    wasmInitMs: counters.wasmInitMs,
    workerId,
  });
}

function emitMetrics(
  onMetrics: WorkerMetricsHandler | undefined,
  state: WorkerMetrics["state"],
  phase?: WorkerPhase,
  chunk?: ChunkContext,
): void {
  onMetrics?.(buildMetrics(state, phase, chunk));
}

function getWasmHeapBytes(): number {
  return engineMemory?.buffer.byteLength ?? 0;
}

const api = {
  getMetrics(): WorkerMetrics {
    return buildMetrics(engineReady && commonReady ? "ready" : "idle");
  },

  init(engineWasm: ArrayBuffer, commonWasm: ArrayBuffer): void {
    const initStartedAt = performance.now();

    void getGameDbLocal();

    if (!engineReady) {
      const output = engineMod.initSync({ module: engineWasm });

      engineMemory = output.memory;
      engineReady = true;
    }

    // docref:start wasm-boundary-worker-init
    if (!commonReady) {
      commonMod.initSync({ module: commonWasm });
      commonReady = true;
    }
    // docref:end wasm-boundary-worker-init

    counters.wasmInitMs = performance.now() - initStartedAt;
  },

  prime(buffer: ArrayBuffer): void {
    bulkBuffer = buffer;
  },

  async runChunk(
    chunk: WorkerChunkPayload,
    keypair: NodeKeypair,
    workerEnv: WorkerEnv,
    onProgress?: WorkerProgressHandler,
    onMetrics?: WorkerMetricsHandler,
    onEvent?: ResolveEventHandler,
  ): Promise<WorkerRunResult> {
    if (!engineReady || !commonReady) {
      throw new Error("Worker not initialized. Call init() first.");
    }

    const chunkCtx: ChunkContext = {
      chunkIndex: chunk.chunkIndex,
      iterations: chunk.iterations,
      jobId: chunk.jobId,
      startedAt: performance.now(),
    };

    const typedSupabase = createWorkerSupabaseClient(workerEnv);

    try {
      emitMetrics(onMetrics, "busy", "fetching", chunkCtx);

      if (!bulkBuffer) {
        throw new Error("Sim worker not primed. Call prime() first.");
      }

      storePromise ??= hydrateWorkerStore(bulkBuffer);
      const store = await storePromise;
      const resolver = createResolver({
        counters,
        onEvent,
        onProgress,
        store,
        supabase: typedSupabase,
      });

      emitMetrics(onMetrics, "busy", "simulating", chunkCtx);
      onProgress?.(
        `Running sim: ${chunk.iterations} iterations, seed=${chunk.seedOffset}`,
      );

      counters.liveCompleted = 0;
      counters.liveTotal = chunk.iterations;
      counters.liveSimsPerSec = 0;
      const simStartedAt = performance.now();
      const simResult = await engineMod.runSimulationWithProgress(
        chunk.simConfig,
        chunk.iterations,
        BigInt(chunk.seedOffset),
        chunk.chunkIndex,
        resolver,
        (snapshot: {
          completed: number;
          done?: boolean;
          elapsedMs?: number;
          meanDps?: number;
          stdDps?: number;
          throughputSps?: number;
          total: number;
        }) => {
          const throughput = snapshot.throughputSps ?? 0;

          counters.liveSimsPerSec = Math.round(throughput);
          counters.liveCompleted = snapshot.completed;
          counters.liveTotal = snapshot.total;
          const percent =
            snapshot.total > 0
              ? (snapshot.completed / snapshot.total) * 100
              : 0;

          onProgress?.(
            `Sim progress: ${snapshot.completed}/${snapshot.total} (${percent.toFixed(1)}%) ${Math.round(throughput)}/s`,
          );
          emitMetrics(onMetrics, "busy", "simulating", chunkCtx);
        },
      );
      const simMs = performance.now() - simStartedAt;

      counters.liveSimsPerSec = 0;
      counters.liveCompleted = 0;
      counters.liveTotal = 0;
      counters.totalIterations += chunk.iterations;
      counters.totalSimTimeMs += simMs;

      const protobufBytes = normalizeProtobufBytes(simResult);

      counters.lastPayloadBytes = protobufBytes.length;
      onProgress?.(
        `Sim complete, protobuf=${protobufBytes.length} bytes (${simMs.toFixed(0)}ms)`,
      );

      emitMetrics(onMetrics, "busy", "signing", chunkCtx);
      const path = "/chunks/complete";
      const sentinelUrl = new URL(
        `${path}?job_id=${chunk.jobId}`,
        workerEnv.sentinelUrl,
      );
      const timestamp = Math.floor(Date.now() / 1000).toString();

      const message = commonMod.buildSignMessageBytes(
        BigInt(timestamp),
        "POST",
        sentinelUrl.host,
        path,
        protobufBytes,
      );
      const signature = commonMod.signMessage(keypair.privateKey, message);

      emitMetrics(onMetrics, "busy", "submitting", chunkCtx);
      onProgress?.(
        `Submitting to ${sentinelUrl.pathname}${sentinelUrl.search}`,
      );

      const bodyBytes = new Uint8Array(protobufBytes);
      const response = await fetch(sentinelUrl.href, {
        body: bodyBytes.buffer,
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Node-Key": keypair.publicKey,
          "X-Node-Sig": signature,
          "X-Node-Ts": timestamp,
        },
        method: "POST",
      });

      if (!response.ok) {
        const text = await response.text();

        throw new Error(`Chunk submit ${response.status}: ${text}`);
      }

      const submitResult = await response.json();

      onProgress?.(`Chunk submitted: ${JSON.stringify(submitResult)}`);

      counters.chunksCompleted++;
      counters.lastChunkMs = performance.now() - chunkCtx.startedAt;
      emitMetrics(onMetrics, "ready");

      return { isSuccess: true };
    } catch (error) {
      counters.chunksFailed++;
      counters.lastChunkMs = performance.now() - chunkCtx.startedAt;
      emitMetrics(onMetrics, "error");

      return {
        error: error instanceof Error ? error.message : String(error),
        isSuccess: false,
      };
    }
  },
};

export type SimWorkerApi = typeof api;

Comlink.expose(api);
