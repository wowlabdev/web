"use client";

import { WasmBoundary } from "@/components/shared/wasm";

import { EngineSkeleton } from "./engine-skeleton";
import { SimulatorContent } from "./simulator-content";

export function SimulatorPage() {
  return (
    <WasmBoundary fallback={<EngineSkeleton />}>
      <SimulatorContent />
    </WasmBoundary>
  );
}
