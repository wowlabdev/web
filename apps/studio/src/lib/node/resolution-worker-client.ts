import type { ResolvedPaperdoll, SpecIntrospection } from "wowlab-common";
import type { IterationTrace } from "wowlab-engine";

import * as Comlink from "comlink";

import { log } from "@/lib/observability";
import { env } from "@wowlab/shared/lib/env";

import type { ResolutionWorkerApi } from "./resolution-worker";
import type { ResolveEventHandler, WorkerEnv } from "./worker-contract";

import { getBulkBuffer } from "./game-data-provider";
import { fetchWasmBytes } from "./wasm-bytes";

const workerEnv: WorkerEnv = {
  sentinelUrl: env.SENTINEL_URL,
  supabasePublishableKey: env.SUPABASE_PUBLISHABLE_KEY,
  supabaseUrl: env.SUPABASE_URL,
};

type ResolutionClient = {
  api: Comlink.Remote<ResolutionWorkerApi>;
  ready: Promise<void>;
  worker: Worker;
};

let client: ResolutionClient | null = null;

export function resetResolutionWorker(): void {
  if (!client) {
    return;
  }

  client.api[Comlink.releaseProxy]();
  client.worker.terminate();
  client = null;
}

export async function resolvePaperdollOnWorker(
  simConfig: string,
  level: number,
  isMale: boolean,
  onEvent?: ResolveEventHandler,
): Promise<ResolvedPaperdoll> {
  const { api, ready } = getClient();

  await ready;

  return api.resolvePaperdoll(
    simConfig,
    level,
    isMale,
    workerEnv,
    onEvent ? Comlink.proxy(onEvent) : undefined,
  );
}

export async function resolveSpecIntrospectionOnWorker(
  specId: number,
  onEvent?: ResolveEventHandler,
): Promise<SpecIntrospection> {
  const { api, ready } = getClient();

  await ready;

  return api.getSpecIntrospectionResolved(
    specId,
    workerEnv,
    onEvent ? Comlink.proxy(onEvent) : undefined,
  );
}

export async function runTraceOnWorker(
  simConfig: string,
  rotationJson: string,
  seed: bigint,
  onEvent?: ResolveEventHandler,
): Promise<IterationTrace> {
  const { api, ready } = getClient();

  await ready;

  return api.runTrace(
    simConfig,
    rotationJson,
    seed,
    workerEnv,
    onEvent ? Comlink.proxy(onEvent) : undefined,
  );
}

export function warmResolutionWorker(): void {
  void getClient().ready.catch((error: unknown) => {
    log.withError(error).error("Resolution worker warm-up failed");
  });
}

function getClient(): ResolutionClient {
  if (client) {
    return client;
  }

  const worker = new Worker(new URL("resolution-worker.ts", import.meta.url), {
    type: "module",
  });
  const api = Comlink.wrap<ResolutionWorkerApi>(worker);

  const ready = fetchWasmBytes().then(async ({ commonWasm, engineWasm }) => {
    const engineCopy = engineWasm.slice(0);
    const commonCopy = commonWasm.slice(0);

    await api.init(
      Comlink.transfer(engineCopy, [engineCopy]),
      Comlink.transfer(commonCopy, [commonCopy]),
    );

    const buffer = (await getBulkBuffer()).slice(0);

    await api.prime(Comlink.transfer(buffer, [buffer]));
  });

  client = { api, ready, worker };

  return client;
}
