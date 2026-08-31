"use client";

import { useSyncExternalStore } from "react";

import type { WasmPhase } from "@/lib/wasm/status";

import {
  getWasmServerSnapshot,
  getWasmSnapshot,
  subscribeWasm,
} from "@/lib/wasm/status";

export type WasmStatus = {
  common: WasmPhase;
  engine: WasmPhase;
  ready: boolean;
};

export function useWasmStatus(): WasmStatus {
  const snap = useSyncExternalStore(
    subscribeWasm,
    getWasmSnapshot,
    getWasmServerSnapshot,
  );

  return {
    ...snap,
    ready: snap.engine === "ready" && snap.common === "ready",
  };
}
