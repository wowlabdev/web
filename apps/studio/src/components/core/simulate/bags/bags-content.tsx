"use client";

import { defineStepper } from "@stepperize/react";
import { useBoolean, useMemoizedFn, useUpdateEffect } from "ahooks";

import { BagsConfigureStep } from "@/components/core/simulate/bags/bags-configure-step";
import { BagsInventoryStep } from "@/components/core/simulate/bags/bags-inventory-step";
import { BlockCombinationsDialog } from "@/components/core/simulate/bags/block-combinations-dialog";
import { ConfirmCombinationsDialog } from "@/components/core/simulate/bags/confirm-combinations-dialog";
import { useJobSubmission } from "@/components/core/simulate/bags/use-job-submission";
import { ImportStep } from "@/components/core/simulate/import-step";
import { SimulateWizardSkeleton } from "@/components/core/simulate/simulate-wizard-skeleton";
import { useSimcParser } from "@/components/core/simulate/use-simc-parser";
import { useSlotGrouping } from "@/components/core/simulate/use-slot-grouping";
import { useSlotSelection } from "@/components/core/simulate/use-slot-selection";
import { useStepLabels } from "@/components/core/simulate/use-step-labels";
import { WasmBoundary } from "@/components/shared/wasm";
import { useAutoSelectRotation } from "@/hooks/use-auto-select-rotation";
import { useRotations } from "@/lib/query/services/game";
import { BIB_BLOCK_THRESHOLD, BIB_WARN_THRESHOLD } from "@/lib/sim/bags-config";
import { StepperNav } from "@wowlab/shared/components/ui/stepper-nav";

const { steps, useStepper } = defineStepper([
  { id: "import" },
  { id: "inventory" },
  { id: "configure" },
]);

export function BagsContent() {
  return (
    <WasmBoundary fallback={<SimulateWizardSkeleton />}>
      <BagsWizard />
    </WasmBoundary>
  );
}

function BagsWizard() {
  const stepper = useStepper();
  const currentId = stepper.current.id;
  const stepLabels = useStepLabels();
  const { parseError, profile, setSimcInput, simcInput, specId, specName } =
    useSimcParser();

  useUpdateEffect(() => {
    if (profile && currentId === "import") {
      void stepper.goTo("inventory");
    }
  }, [profile]);

  const handleNavSelect = useMemoizedFn(
    (id: "configure" | "import" | "inventory") => {
      void stepper.goTo(id);
    },
  );

  const { slotGroups } = useSlotGrouping(profile);
  const selection = useSlotSelection(profile, slotGroups);

  const { data: rotations } = useRotations(specId ?? 0);

  useAutoSelectRotation(specId, rotations);

  const hasContestedSlots = selection.combinationCount > 1;
  const { canSubmit, isSubmitting, submit, submitError } = useJobSubmission(
    profile,
    selection.space,
    hasContestedSlots,
  );

  const [confirmOpen, { setFalse: closeConfirm, setTrue: openConfirm }] =
    useBoolean(false);
  const [blockOpen, { setFalse: closeBlock, setTrue: openBlock }] =
    useBoolean(false);

  const handleSubmit = useMemoizedFn(() => {
    if (!profile) {
      return;
    }

    if (selection.combinationCount > BIB_BLOCK_THRESHOLD) {
      openBlock();

      return;
    }

    if (selection.combinationCount > BIB_WARN_THRESHOLD) {
      openConfirm();

      return;
    }

    submit();
  });

  const handleConfirmRun = useMemoizedFn(() => {
    closeConfirm();
    submit();
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
            <BagsConfigureStep
              canSubmit={canSubmit}
              hasContestedSlots={hasContestedSlots}
              isSubmitting={isSubmitting}
              onBack={() => stepper.goTo("inventory")}
              onSubmit={handleSubmit}
              specId={specId}
              specName={specName}
              submitError={submitError}
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
              <BagsInventoryStep
                combinationCount={selection.combinationCount}
                getSlotItems={selection.getSlotItems}
                hasInventory={selection.hasInventory}
                onBack={() => stepper.goTo("import")}
                onDeselectAll={selection.deselectAll}
                onIncludeWeeklyChange={selection.setIncludeWeekly}
                onNext={() => stepper.goTo("configure")}
                onSelectAll={selection.selectAll}
                onToggleItem={selection.toggleItem}
                profile={profile}
                selectedCount={selection.selectedCount}
                shouldIncludeWeekly={selection.shouldIncludeWeekly}
                totalAvailable={selection.totalAvailable}
              />
            ),
        })}
      </div>

      <ConfirmCombinationsDialog
        combinationCount={selection.combinationCount}
        isOpen={confirmOpen}
        onConfirm={handleConfirmRun}
        onOpenChange={(open) => (open ? openConfirm() : closeConfirm())}
      />

      <BlockCombinationsDialog
        combinationCount={selection.combinationCount}
        isOpen={blockOpen}
        onOpenChange={(open) => (open ? openBlock() : closeBlock())}
      />
    </div>
  );
}
