"use client";

import { useMemoizedFn } from "ahooks";

import { DropsContent } from "@/components/core/simulate/drops/drops-content";
import { useDropsSources } from "@/components/core/simulate/drops/use-drops-sources";
import { SimulateWizardSkeleton } from "@/components/core/simulate/simulate-wizard-skeleton";
import { useSimcParser } from "@/components/core/simulate/use-simc-parser";
import { WasmBoundary } from "@/components/shared/wasm";
import { useAutoSelectRotation } from "@/hooks/use-auto-select-rotation";
import { useRotations } from "@/lib/query/services/game";
import { useSubmitJob } from "@/lib/query/services/jobs";

export function DropsPage() {
  return (
    <WasmBoundary fallback={<SimulateWizardSkeleton />}>
      <DropsWizard />
    </WasmBoundary>
  );
}

function DropsWizard() {
  const { parseError, profile, setSimcInput, simcInput, specId, specName } =
    useSimcParser();
  const sources = useDropsSources();
  const { data: rotations } = useRotations(specId ?? 0);

  useAutoSelectRotation(specId, rotations);
  const { canSubmit, isSubmitting, submit, submitError } = useSubmitJob();

  const handleSubmit = useMemoizedFn(() => {
    if (!profile) {
      return;
    }

    submit(profile);
  });

  return (
    <DropsContent
      canSubmit={canSubmit}
      isSubmitting={isSubmitting}
      onSimcInputChange={setSimcInput}
      onSubmit={handleSubmit}
      parseError={parseError}
      profile={profile}
      simcInput={simcInput}
      sources={sources}
      specId={specId}
      specName={specName}
      submitError={submitError}
    />
  );
}
