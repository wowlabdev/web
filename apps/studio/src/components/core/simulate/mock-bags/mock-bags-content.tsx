"use client";

import type { Profile } from "wowlab-common";

import { defineStepper } from "@stepperize/react";
import { useMemoizedFn, useMount, useUpdateEffect } from "ahooks";

import { ImportStep } from "@/components/core/simulate/import-step";
import { useSlotGrouping } from "@/components/core/simulate/use-slot-grouping";
import { useStepLabels } from "@/components/core/simulate/use-step-labels";
import { StepperNav } from "@wowlab/shared/components/ui/stepper-nav";

import { ConfigureStep } from "./configure-step";
import { InventoryStep } from "./inventory-step";
import { useMockSimulationEngine } from "./use-mock-simulation-engine";

const { steps, useStepper } = defineStepper([
  { id: "import" },
  { id: "inventory" },
  { id: "configure" },
]);

type MockBagsContentProps = {
  initialStepId?: "import" | "inventory" | "configure";
  parseError: string | null;
  profile: Profile | null;
  setSimcInput: (value: string) => void;
  simcInput: string;
  specId: number | null;
  specName: string | null;
};

export function MockBagsContent({
  initialStepId,
  parseError,
  profile,
  setSimcInput,
  simcInput,
  specId,
  specName,
}: Readonly<MockBagsContentProps>) {
  const stepper = useStepper();
  const currentId = stepper.current.id;
  const stepLabels = useStepLabels();

  const { simItems, slotGroups } = useSlotGrouping(profile);
  const {
    bestPermDps,
    bestSet,
    chunk,
    dpsHistory,
    expandedSlot,
    flashSlots,
    permsSimmed,
    phase,
    resetSim,
    simSlots,
    simsPerSec,
    startSim,
    toggleExpandedSlot,
  } = useMockSimulationEngine(simItems);

  useMount(() => {
    if (initialStepId && stepper.current.id !== initialStepId) {
      void stepper.goTo(initialStepId);
    }
  });

  useUpdateEffect(() => {
    if (profile && stepper.current.id === "import") {
      void stepper.goTo("inventory");
    }
  }, [profile]);

  const handleNavSelect = useMemoizedFn(
    (id: "configure" | "import" | "inventory") => {
      void stepper.goTo(id);
    },
  );

  const handleStartSim = useMemoizedFn(() => {
    void stepper.goTo("inventory");
    void startSim();
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
            <ConfigureStep
              onBack={() => stepper.goTo("inventory")}
              onStart={handleStartSim}
              phase={phase}
              specName={specName}
            />
          ),

          import: () => (
            <ImportStep
              onNext={() => stepper.goTo("inventory")}
              parseError={parseError}
              profile={profile}
              setSimcInput={setSimcInput}
              simcInput={simcInput}
              specId={specId}
            />
          ),

          inventory: () =>
            profile && (
              <InventoryStep
                bestPermDps={bestPermDps}
                bestSet={bestSet}
                chunk={chunk}
                dpsHistory={dpsHistory}
                expandedSlot={expandedSlot}
                flashSlots={flashSlots}
                onBack={() => stepper.goTo("import")}
                onNext={() => stepper.goTo("configure")}
                onResetSim={resetSim}
                onToggleExpandedSlot={toggleExpandedSlot}
                permsSimmed={permsSimmed}
                phase={phase}
                profile={profile}
                simItems={simItems}
                simSlots={simSlots}
                simsPerSec={simsPerSec}
                slotGroups={slotGroups}
              />
            ),
        })}
      </div>
    </div>
  );
}
