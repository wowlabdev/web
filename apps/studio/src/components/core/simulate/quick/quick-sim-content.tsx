"use client";

import type { Profile } from "wowlab-common";

import { defineStepper } from "@stepperize/react";
import { useMemoizedFn, useMount, useUpdateEffect } from "ahooks";

import { useStepLabels } from "@/components/core/simulate/use-step-labels";
import { StepperNav } from "@wowlab/shared/components/ui/stepper-nav";

import { QuickSimConfigureStep } from "./quick-sim-configure-step";
import { QuickSimImportStep } from "./quick-sim-import-step";

const { steps, useStepper } = defineStepper([
  { id: "import" },
  { id: "configure" },
]);

type QuickSimContentProps = {
  canSubmit: boolean;
  initialStepId?: "import" | "configure";
  isLoadingRotations: boolean;
  isSubmitting: boolean;
  iterations: number;
  onIterationsChange: (value: number) => void;
  onRotationIdChange: (value: string) => void;
  onSimcInputChange: (value: string) => void;
  onSubmit: () => void;
  parseError: string | null;
  profile: Profile | null;
  rotationId: string | null;
  rotations: { id: string; name: string }[] | undefined;
  simcInput: string;
  specId: number | null;
  specName: string | null;
  submitError: string | null;
};

export function QuickSimContent({
  canSubmit,
  initialStepId,
  isLoadingRotations,
  isSubmitting,
  iterations,
  onIterationsChange,
  onRotationIdChange,
  onSimcInputChange,
  onSubmit,
  parseError,
  profile,
  rotationId,
  rotations,
  simcInput,
  specId,
  specName,
  submitError,
}: Readonly<QuickSimContentProps>) {
  const stepper = useStepper();
  const currentId = stepper.current.id;
  const stepLabels = useStepLabels();

  useMount(() => {
    if (initialStepId && stepper.current.id !== initialStepId) {
      void stepper.goTo(initialStepId);
    }
  });

  useUpdateEffect(() => {
    if (profile && stepper.current.id === "import") {
      void stepper.goTo("configure");
    }
  }, [profile]);

  const handleNavSelect = useMemoizedFn((id: "configure" | "import") => {
    void stepper.goTo(id);
  });

  return (
    <div className="space-y-6">
      <StepperNav
        currentId={currentId}
        steps={steps}
        labels={stepLabels}
        isUnlocked={(id) => id === "import" || !!profile}
        onSelect={handleNavSelect}
      />

      <div className="mt-4 space-y-4">
        {stepper.match({
          configure: () => (
            <QuickSimConfigureStep
              canSubmit={canSubmit}
              isLoadingRotations={isLoadingRotations}
              isSubmitting={isSubmitting}
              iterations={iterations}
              onBack={() => stepper.goTo("import")}
              onIterationsChange={onIterationsChange}
              onRotationIdChange={onRotationIdChange}
              onSubmit={onSubmit}
              profile={profile}
              rotationId={rotationId}
              rotations={rotations}
              specId={specId}
              specName={specName}
              submitError={submitError}
            />
          ),

          import: () => (
            <QuickSimImportStep
              onNext={() => stepper.goTo("configure")}
              onSimcInputChange={onSimcInputChange}
              parseError={parseError}
              profile={profile}
              simcInput={simcInput}
              specId={specId}
            />
          ),
        })}
      </div>
    </div>
  );
}
