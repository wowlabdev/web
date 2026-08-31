"use client";

import { useMemoizedFn } from "ahooks";

import { QuickSimContent } from "@/components/core/simulate/quick/quick-sim-content";
import { SimulateWizardSkeleton } from "@/components/core/simulate/simulate-wizard-skeleton";
import { useSimcParser } from "@/components/core/simulate/use-simc-parser";
import { WasmBoundary } from "@/components/shared/wasm";
import { useAutoSelectRotation } from "@/hooks/use-auto-select-rotation";
import { useRotations } from "@/lib/query/services/game";
import { useSubmitJob } from "@/lib/query/services/jobs";
import { useSimulatorStore } from "@/lib/state";

export function QuickSimPage() {
  return (
    <WasmBoundary fallback={<SimulateWizardSkeleton />}>
      <QuickSimWizard />
    </WasmBoundary>
  );
}

function QuickSimWizard() {
  const { parseError, profile, setSimcInput, simcInput, specId, specName } =
    useSimcParser();
  const iterations = useSimulatorStore((s) => s.iterations);
  const rotationId = useSimulatorStore((s) => s.rotationId);
  const setIterations = useSimulatorStore((s) => s.setIterations);
  const setRotationId = useSimulatorStore((s) => s.setRotationId);
  const { data: rotations, isLoading: isLoadingRotations } = useRotations(
    specId ?? 0,
  );
  const { canSubmit, isSubmitting, submit, submitError } = useSubmitJob();

  useAutoSelectRotation(specId, rotations);

  const handleSubmit = useMemoizedFn(() => {
    if (!profile) {
      return;
    }

    submit(profile);
  });

  return (
    <QuickSimContent
      canSubmit={canSubmit}
      isSubmitting={isSubmitting}
      iterations={iterations}
      onIterationsChange={(v) => setIterations(v)}
      onRotationIdChange={(v) => setRotationId(v)}
      onSimcInputChange={setSimcInput}
      onSubmit={handleSubmit}
      parseError={parseError}
      profile={profile}
      rotationId={rotationId}
      rotations={rotations}
      isLoadingRotations={isLoadingRotations}
      simcInput={simcInput}
      specId={specId}
      specName={specName}
      submitError={submitError}
    />
  );
}
