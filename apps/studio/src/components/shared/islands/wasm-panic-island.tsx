"use client";

import { useEffect } from "react";

import { captureError } from "@/lib/observability";

const ENGINE_PANIC_TYPE = "wowlab:engine-panic";

type EnginePanicMessage = {
  message?: unknown;
  type?: string;
};

export function WasmPanicIsland() {
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data as EnginePanicMessage | null;

      if (data?.type !== ENGINE_PANIC_TYPE) {
        return;
      }

      const message =
        typeof data.message === "string"
          ? data.message
          : "Unknown WASM engine panic";
      const error = new Error(message);

      error.name = "WasmEnginePanic";
      captureError(error, "wasm-engine", "WASM engine panic");
    }

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
