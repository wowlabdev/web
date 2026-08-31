"use client";

import { useAsyncEffect, useUnmount, useUnmountedRef } from "ahooks";
import { useRef } from "react";

import type { WorkerEnv } from "@/lib/node/worker-contract";

import {
  connectToBeacon,
  getOrCreateKeypair,
  registerBrowserNode,
  useRuntimeStore,
} from "@/lib/node";
import { formatError } from "@/lib/node/format-error";
import { fetchWasmBytes } from "@/lib/node/wasm-bytes";
import { WorkerManager } from "@/lib/node/worker-manager";
import { fetchSessionClaims, fetchTokenClaim } from "@/lib/query/services";
import { getCommon } from "@/lib/wasm/loaders/common";
import { useWasmStatus } from "@/lib/wasm/use-wasm-status";
import { env } from "@wowlab/shared/lib/env";

export function useNodeConnection() {
  const { common: commonPhase } = useWasmStatus();
  const cleanupRef = useRef<(() => void) | null>(null);
  const initRunRef = useRef(0);
  const unmountedRef = useUnmountedRef();

  useAsyncEffect(async () => {
    const { appendChunk, log, setManager, setStatus, setWorkerMetrics } =
      useRuntimeStore.getState();

    if (commonPhase !== "ready") {
      void getCommon();

      return;
    }

    const common = await getCommon();

    const runId = ++initRunRef.current;
    const isStale = () => unmountedRef.current || runId !== initRunRef.current;

    cleanupRef.current?.();
    cleanupRef.current = null;

    useRuntimeStore.getState().manager?.dispose();
    setManager(null);

    setStatus("registering");
    log("Starting registration...");

    try {
      log("Fetching WASM bytes...");
      const manager = new WorkerManager();

      setManager(manager);
      manager.onMetrics = setWorkerMetrics;
      manager.onFatalError = (message) => {
        log(`Worker fatal: ${message}`);
      };

      const bootPromise = fetchWasmBytes()
        .then(({ commonWasm, engineWasm }) => {
          log(
            `WASM bytes fetched (engine=${engineWasm.byteLength}, common=${commonWasm.byteLength})`,
          );

          return manager.boot(engineWasm, commonWasm);
        })
        .then(() => {
          log(
            `Worker pool booted (${manager.workerCount} workers), WASM initialized via initSync`,
          );
        });

      log("Fetching auth user...");
      const { data: claimsData, error: claimsError } =
        await fetchSessionClaims();

      if (isStale()) {
        return;
      }

      if (claimsError) {
        log("Failed to fetch auth user");
        setStatus("error");

        return;
      }

      const claims = claimsData?.claims;

      if (!claims) {
        log("No authenticated user, staying idle");
        setStatus("idle");

        return;
      }

      log(`Authenticated as ${claims.email ?? claims.sub}`);

      log("Fetching token_claim from user_settings...");
      const { data: userSettings, error: settingsError } =
        await fetchTokenClaim(claims.sub);

      if (isStale()) {
        return;
      }

      if (settingsError) {
        log(
          `user_settings error: ${settingsError.message} (${settingsError.code})`,
        );
        setStatus("idle");

        return;
      }

      const claim = userSettings.token_claim;

      if (!claim) {
        log("No token_claim set in user_settings");
        setStatus("idle");

        return;
      }

      log(`Got token_claim: ${claim.slice(0, 8)}...`);

      log("Registering browser node with sentinel...");
      const beaconToken = await registerBrowserNode(common, claim);

      if (isStale()) {
        return;
      }

      log(`Got beacon token: ${beaconToken.slice(0, 16)}...`);

      await bootPromise;

      if (isStale()) {
        return;
      }

      log("Connecting to beacon realtime...");
      const cleanup = connectToBeacon({
        beaconToken,
        common,
        log,
        onChunk: (chunk) => {
          log(
            `Chunk received: job=${chunk.jobId} idx=${chunk.chunkIndex} iters=${chunk.iterations} seed=${chunk.seedOffset}`,
          );
          appendChunk(chunk);

          const keypair = getOrCreateKeypair(common);
          const workerEnv: WorkerEnv = {
            sentinelUrl: env.SENTINEL_URL,
            supabasePublishableKey: env.SUPABASE_PUBLISHABLE_KEY,
            supabaseUrl: env.SUPABASE_URL,
          };

          manager
            .runChunk(chunk, keypair, workerEnv, log)
            .then((result) => {
              if (!result.isSuccess) {
                log(`Chunk execution failed: ${result.error}`);
              }
            })
            .catch((error) => {
              log(`Chunk execution error: ${formatError(error)}`);
            });
        },
      });

      if (isStale()) {
        cleanup();

        return;
      }

      cleanupRef.current = cleanup;
      setStatus("connected");
      log("Connected to beacon");
    } catch (error) {
      if (isStale()) {
        return;
      }

      log(`Error: ${formatError(error)}`);
      setStatus("error");
    }
  }, [commonPhase]);

  useUnmount(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    useRuntimeStore.getState().manager?.dispose();
    useRuntimeStore.getState().setManager(null);
  });
}
