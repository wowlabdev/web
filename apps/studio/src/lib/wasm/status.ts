export type WasmPhase = "idle" | "loading" | "ready" | "error";

export type WasmSnapshot = {
  common: WasmPhase;
  engine: WasmPhase;
};

const SERVER_SNAPSHOT: WasmSnapshot = Object.freeze({
  common: "idle",
  engine: "idle",
});

let enginePhase: WasmPhase = "idle";
let commonPhase: WasmPhase = "idle";
let snapshot: WasmSnapshot = { common: commonPhase, engine: enginePhase };

const listeners = new Set<() => void>();

export function getWasmServerSnapshot(): WasmSnapshot {
  return SERVER_SNAPSHOT;
}

export function getWasmSnapshot(): WasmSnapshot {
  // Must return a stable reference until reportWasmPhase replaces it, or useSyncExternalStore loops forever.
  return snapshot;
}

export function isWasmSupported(): boolean {
  try {
    if (typeof WebAssembly !== "object") {
      return false;
    }

    // docref:start portal-arch-wasm-detect
    const wasmModule = new WebAssembly.Module(
      Uint8Array.of(0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
    );
    // docref:end portal-arch-wasm-detect

    return wasmModule instanceof WebAssembly.Module;
  } catch {
    return false;
  }
}

export function reportWasmPhase(
  module: "common" | "engine",
  phase: WasmPhase,
): void {
  if (module === "engine") {
    enginePhase = phase;
  } else {
    commonPhase = phase;
  }

  snapshot = { common: commonPhase, engine: enginePhase };

  for (const listener of listeners) {
    listener();
  }
}

export function subscribeWasm(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
