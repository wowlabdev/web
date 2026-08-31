"use client";

import type { Profile } from "wowlab-common";

import { defineStepper } from "@stepperize/react";
import { useMemoizedFn, useMount, useUpdateEffect } from "ahooks";

import type { DropsSourcesState } from "@/components/core/simulate/drops/use-drops-sources";

import { DropsConfigureStep } from "@/components/core/simulate/drops/drops-configure-step";
import { DropsSourcesStep } from "@/components/core/simulate/drops/drops-sources-step";
import { ImportStep } from "@/components/core/simulate/import-step";
import { useStepLabels } from "@/components/core/simulate/use-step-labels";
import { StepperNav } from "@wowlab/shared/components/ui/stepper-nav";

const { steps, useStepper } = defineStepper([
  { id: "import" },
  { id: "sources" },
  { id: "configure" },
]);

type DropsContentProps = {
  canSubmit: boolean;
  initialStepId?: "import" | "sources" | "configure";
  isSubmitting: boolean;
  onSimcInputChange: (value: string) => void;
  onSubmit: () => void;
  parseError: string | null;
  profile: Profile | null;
  simcInput: string;
  sources: DropsSourcesState;
  specId: number | null;
  specName: string | null;
  submitError: string | null;
};

export function DropsContent({
  canSubmit,
  initialStepId,
  isSubmitting,
  onSimcInputChange,
  onSubmit,
  parseError,
  profile,
  simcInput,
  sources,
  specId,
  specName,
  submitError,
}: Readonly<DropsContentProps>) {
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
      void stepper.goTo("sources");
    }
  }, [profile]);

  const handleNavSelect = useMemoizedFn(
    (id: "configure" | "import" | "sources") => {
      void stepper.goTo(id);
    },
  );

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
            <DropsConfigureStep
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              onBack={() => stepper.goTo("sources")}
              onSubmit={onSubmit}
              specId={specId}
              specName={specName}
              submitError={submitError}
            />
          ),

          import: () => (
            <ImportStep
              onNext={() => stepper.goTo("sources")}
              parseError={parseError}
              profile={profile}
              setSimcInput={onSimcInputChange}
              simcInput={simcInput}
              specId={specId}
            />
          ),

          sources: () => (
            <DropsSourcesStep
              categoryCount={sources.categoryCount}
              difficulty={sources.difficulty}
              getInstanceRows={sources.getInstanceRows}
              keyLevel={sources.keyLevel}
              onBack={() => stepper.goTo("import")}
              onDifficultyChange={sources.setDifficulty}
              onKeyLevelChange={sources.setKeyLevel}
              onNext={() => stepper.goTo("configure")}
              onToggleCategory={sources.toggleCategory}
              onToggleSource={sources.toggleSource}
              selectedCategories={sources.selectedCategories}
              sourceCount={sources.sourceCount}
            />
          ),
        })}
      </div>
    </div>
  );
}
