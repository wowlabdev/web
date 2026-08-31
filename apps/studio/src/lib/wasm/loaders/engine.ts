import { reportWasmPhase } from "@/lib/wasm/status";

type EngineModule = typeof import("wowlab-engine");

let cachedModule: EngineModule | null = null;
let initPromise: Promise<EngineModule> | null = null;

export async function getEngine(): Promise<EngineModule> {
  // wasm-bindgen browser output cannot instantiate on the server (workerd has no DOM/WebAssembly host bindings).
  if (typeof window === "undefined") {
    throw new TypeError(
      "getEngine() called on the server — wrap the consumer in <WasmBoundary>.",
    );
  }

  if (cachedModule) {
    return cachedModule;
  }

  if (!initPromise) {
    initPromise = (async () => {
      reportWasmPhase("engine", "loading");

      try {
        const m = await import("wowlab-engine");

        await m.default();
        cachedModule = m;
        reportWasmPhase("engine", "ready");

        return m;
      } catch (error) {
        reportWasmPhase("engine", "error");
        initPromise = null;
        throw error;
      }
    })();
  }

  return initPromise;
}

export function isEngineReady(): boolean {
  return cachedModule !== null;
}
