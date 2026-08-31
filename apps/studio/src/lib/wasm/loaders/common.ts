import { reportWasmPhase } from "@/lib/wasm/status";

type CommonModule = typeof import("wowlab-common");

let cachedModule: CommonModule | null = null;
let initPromise: Promise<CommonModule> | null = null;

export async function getCommon(): Promise<CommonModule> {
  // wasm-bindgen browser output cannot instantiate on the server (workerd has no DOM/WebAssembly host bindings).
  if (typeof window === "undefined") {
    throw new TypeError(
      "getCommon() called on the server — wrap the consumer in <WasmBoundary>.",
    );
  }

  if (cachedModule) {
    return cachedModule;
  }

  if (!initPromise) {
    initPromise = (async () => {
      reportWasmPhase("common", "loading");

      try {
        const m = await import("wowlab-common");

        await m.default();
        cachedModule = m;
        reportWasmPhase("common", "ready");

        return m;
      } catch (error) {
        reportWasmPhase("common", "error");
        initPromise = null;
        throw error;
      }
    })();
  }

  return initPromise;
}

export function isCommonReady(): boolean {
  return cachedModule !== null;
}
