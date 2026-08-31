import type { ResolvedPaperdoll, SpecIntrospection } from "wowlab-common";
import type { IterationTrace } from "wowlab-engine";

import * as Comlink from "comlink";
import * as commonMod from "wowlab-common";
import * as engineMod from "wowlab-engine";

import { getGameDbLocal } from "@/lib/game-data/store";

import type { WorkerStore } from "./resolver-types";
import type { ResolveEventHandler, WorkerEnv } from "./worker-contract";

import { createResolver } from "./resolver";
import { createWorkerSupabaseClient } from "./resolver-client";
import { hydrateWorkerStore } from "./resolver-store";

let commonReady = false;
let engineReady = false;
let storePromise: Promise<WorkerStore> | null = null;
let bulkBuffer: ArrayBuffer | undefined;

const counters = { cacheHits: 0, cacheMisses: 0 };

async function resolverFor(
  workerEnv: WorkerEnv,
  onEvent?: ResolveEventHandler,
) {
  if (!engineReady || !commonReady) {
    throw new Error("Resolution worker not initialized. Call init() first.");
  }

  if (!bulkBuffer) {
    throw new Error("Resolution worker not primed. Call prime() first.");
  }

  const supabase = createWorkerSupabaseClient(workerEnv);

  storePromise ??= hydrateWorkerStore(bulkBuffer);

  const store = await storePromise;

  return createResolver({ counters, onEvent, store, supabase });
}

const api = {
  async getSpecIntrospectionResolved(
    specId: number,
    workerEnv: WorkerEnv,
    onEvent?: ResolveEventHandler,
  ): Promise<SpecIntrospection> {
    const resolver = await resolverFor(workerEnv, onEvent);

    return (await engineMod.getSpecIntrospectionResolved(
      specId,
      resolver,
    )) as SpecIntrospection;
  },

  init(engineWasm: ArrayBuffer, commonWasm: ArrayBuffer): void {
    void getGameDbLocal();

    if (!engineReady) {
      engineMod.initSync({ module: engineWasm });
      engineReady = true;
    }

    if (!commonReady) {
      commonMod.initSync({ module: commonWasm });
      commonReady = true;
    }
  },

  prime(buffer: ArrayBuffer): void {
    bulkBuffer = buffer;
  },

  async resolvePaperdoll(
    simConfig: string,
    level: number,
    isMale: boolean,
    workerEnv: WorkerEnv,
    onEvent?: ResolveEventHandler,
  ): Promise<ResolvedPaperdoll> {
    const resolver = await resolverFor(workerEnv, onEvent);

    return (await engineMod.resolvePaperdoll(
      simConfig,
      level,
      isMale,
      resolver,
    )) as ResolvedPaperdoll;
  },

  async runTrace(
    simConfig: string,
    rotationJson: string,
    seed: bigint,
    workerEnv: WorkerEnv,
    onEvent?: ResolveEventHandler,
  ): Promise<IterationTrace> {
    const resolver = await resolverFor(workerEnv, onEvent);

    return (await engineMod.runIterationTrace(
      simConfig,
      rotationJson,
      seed,
      resolver,
    )) as IterationTrace;
  },
};

export type ResolutionWorkerApi = typeof api;

Comlink.expose(api);
