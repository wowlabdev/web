"use client";

import { useIntlayer } from "next-intlayer";

import { IterationsField } from "@/components/core/simulate/iterations-field";
import { RotationSelectField } from "@/components/core/simulate/rotation-select-field";
import { useRotations } from "@/lib/query/services/game";
import { useSimulatorStore } from "@/lib/state";
import { Button } from "@wowlab/shared/components/ui/button";

type DropsConfigureStepProps = {
  canSubmit: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
  specId: number | null;
  specName: string | null;
  submitError: string | null;
};

export function DropsConfigureStep({
  canSubmit,
  isSubmitting,
  onBack,
  onSubmit,
  specId,
  specName,
  submitError,
}: Readonly<DropsConfigureStepProps>) {
  const content = useIntlayer("simulateDrops");
  const shared = useIntlayer("simulateShared");
  const iterations = useSimulatorStore((s) => s.iterations);
  const rotationId = useSimulatorStore((s) => s.rotationId);
  const setIterations = useSimulatorStore((s) => s.setIterations);
  const setRotationId = useSimulatorStore((s) => s.setRotationId);
  const { data: rotations, isLoading: isLoadingRotations } = useRotations(
    specId ?? 0,
  );

  return (
    <>
      {specId ? (
        <RotationSelectField
          isLoading={isLoadingRotations}
          label={content.rotationLabel.value}
          loadingLabel={content.loadingRotations.value}
          noRotationsLabel={content.noRotations({ spec: specName ?? "" }).value}
          onRotationIdChange={(val) => setRotationId(val)}
          placeholder={content.rotationPlaceholder.value}
          rotationId={rotationId}
          rotations={rotations}
        />
      ) : null}

      <IterationsField
        hint={content.iterationsHint.value}
        iterations={iterations}
        label={content.iterationsLabel.value}
        onIterationsChange={setIterations}
      />

      {submitError && <p className="text-xs text-destructive">{submitError}</p>}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {shared.back}
        </Button>
        <Button onClick={onSubmit} loading={isSubmitting} disabled={!canSubmit}>
          {isSubmitting ? content.submitting : content.runSimulation}
        </Button>
      </div>
    </>
  );
}
