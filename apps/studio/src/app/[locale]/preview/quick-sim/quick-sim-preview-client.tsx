"use client";

import { QuickSimContent } from "@/components/core/simulate/quick/quick-sim-content";
import {
  LANDING_NOOP,
  LANDING_PROFILE,
  LANDING_ROTATION_ID,
  LANDING_ROTATIONS_FOR_SPEC,
  LANDING_SIMC_INPUT_PREVIEW,
  LANDING_SPEC_ID,
  LANDING_SPEC_NAME,
} from "@/components/shared/landing/__fixtures__/landing-fixtures";

export function QuickSimPreviewClient() {
  return (
    <QuickSimContent
      canSubmit
      initialStepId="configure"
      isLoadingRotations={false}
      isSubmitting={false}
      iterations={10_000}
      onIterationsChange={LANDING_NOOP}
      onRotationIdChange={LANDING_NOOP}
      onSimcInputChange={LANDING_NOOP}
      onSubmit={LANDING_NOOP}
      parseError={null}
      profile={LANDING_PROFILE}
      rotationId={LANDING_ROTATION_ID}
      rotations={LANDING_ROTATIONS_FOR_SPEC}
      simcInput={LANDING_SIMC_INPUT_PREVIEW}
      specId={LANDING_SPEC_ID}
      specName={LANDING_SPEC_NAME}
      submitError={null}
    />
  );
}
