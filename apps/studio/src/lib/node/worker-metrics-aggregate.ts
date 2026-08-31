import type { WorkerSlot } from "./worker-slot";

import { createWorkerMetrics, type WorkerMetrics } from "./worker-metrics";

export function buildAggregateMetrics(
  perWorker: WorkerMetrics[],
  poolSize: number,
): WorkerMetrics {
  if (perWorker.length === 0) {
    return createWorkerMetrics();
  }

  const busy = perWorker.filter((m) => m.state === "busy");
  const simulating = perWorker.filter(
    (m) => m.state === "busy" && m.currentPhase === "simulating",
  );

  const totalIterations = perWorker.reduce(
    (sum, m) => sum + m.totalIterations,
    0,
  );
  const totalSimTimeMs = perWorker.reduce(
    (sum, m) => sum + m.totalSimTimeMs,
    0,
  );
  const jobsInFlight = new Set(busy.map((m) => m.currentJobId).filter(Boolean));

  const poolState = derivePoolState(perWorker);

  const phaseOrder: Array<WorkerMetrics["currentPhase"]> = [
    "simulating",
    "fetching",
    "submitting",
    "signing",
  ];
  const currentPhase = phaseOrder.find((phase) =>
    perWorker.some((m) => m.state === "busy" && m.currentPhase === phase),
  );

  return createWorkerMetrics({
    avgSimsPerSec:
      totalSimTimeMs > 0 ? totalIterations / (totalSimTimeMs / 1000) : 0,
    cacheHits: perWorker.reduce((sum, m) => sum + m.cacheHits, 0),
    cacheMisses: perWorker.reduce((sum, m) => sum + m.cacheMisses, 0),
    chunkElapsedMs:
      busy.length > 0
        ? Math.max(...busy.map((m) => m.chunkElapsedMs ?? 0))
        : undefined,
    chunksCompleted: perWorker.reduce((sum, m) => sum + m.chunksCompleted, 0),
    chunksFailed: perWorker.reduce((sum, m) => sum + m.chunksFailed, 0),
    currentChunkIndex:
      busy.length === 1 ? busy[0].currentChunkIndex : undefined,
    currentIterations:
      busy.length > 0
        ? busy.reduce((sum, m) => sum + (m.currentIterations ?? 0), 0)
        : undefined,
    currentJobId: jobsInFlight.size === 1 ? [...jobsInFlight][0] : undefined,
    currentPhase,
    lastChunkMs: Math.max(...perWorker.map((m) => m.lastChunkMs)),
    lastPayloadBytes: perWorker.reduce((sum, m) => sum + m.lastPayloadBytes, 0),
    liveCompleted: simulating.reduce((sum, m) => sum + m.liveCompleted, 0),
    liveSimsPerSec: simulating.reduce((sum, m) => sum + m.liveSimsPerSec, 0),
    liveTotal: simulating.reduce((sum, m) => sum + m.liveTotal, 0),
    poolSize,
    state: poolState,
    totalIterations,
    totalSimTimeMs,
    uptimeMs: Math.max(...perWorker.map((m) => m.uptimeMs)),
    wasmHeapBytes: perWorker.reduce((sum, m) => sum + m.wasmHeapBytes, 0),
    wasmInitMs: Math.max(...perWorker.map((m) => m.wasmInitMs)),
    workerId: "pool",
    workers: perWorker,
  });
}

export function sanitizeWorkerMetrics(
  slot: WorkerSlot,
  metrics: WorkerMetrics,
): WorkerMetrics {
  return {
    ...metrics,
    isEnabled: slot.isEnabled,
    poolSize: undefined,
    workerId: metrics.workerId || slot.id,
    workers: undefined,
  };
}

function derivePoolState(perWorker: WorkerMetrics[]): WorkerMetrics["state"] {
  if (perWorker.some((m) => m.state === "error")) {
    return "error";
  }

  if (perWorker.some((m) => m.state === "busy")) {
    return "busy";
  }

  if (perWorker.some((m) => m.state === "initializing")) {
    return "initializing";
  }

  if (perWorker.every((m) => m.state === "terminated")) {
    return "terminated";
  }

  if (perWorker.some((m) => m.state === "ready")) {
    return "ready";
  }

  return "idle";
}
