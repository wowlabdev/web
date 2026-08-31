"use client";

import { useMount } from "ahooks";

import { MockBagsContent } from "@/components/core/simulate/mock-bags/mock-bags-content";
import { MOCK_SIMC_INPUT } from "@/components/core/simulate/mock-bags/mock-simc-input";
import { SimulateWizardSkeleton } from "@/components/core/simulate/simulate-wizard-skeleton";
import { useSimcParser } from "@/components/core/simulate/use-simc-parser";
import { WasmBoundary } from "@/components/shared/wasm";

export function MockBagsPage() {
  return (
    <WasmBoundary fallback={<SimulateWizardSkeleton />}>
      <MockBagsWizard />
    </WasmBoundary>
  );
}

function MockBagsWizard() {
  const { parseError, profile, setSimcInput, simcInput, specId, specName } =
    useSimcParser();

  useMount(() => {
    if (!simcInput) {
      setSimcInput(MOCK_SIMC_INPUT);
    }
  });

  return (
    <MockBagsContent
      parseError={parseError}
      profile={profile}
      setSimcInput={setSimcInput}
      simcInput={simcInput}
      specId={specId}
      specName={specName}
    />
  );
}
