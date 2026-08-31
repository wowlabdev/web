"use client";

import { MockBagsContent } from "@/components/core/simulate/mock-bags/mock-bags-content";
import {
  LANDING_NOOP,
  LANDING_PROFILE,
  LANDING_SIMC_INPUT_PREVIEW,
  LANDING_SPEC_ID,
  LANDING_SPEC_NAME,
} from "@/components/shared/landing/__fixtures__/landing-fixtures";

export function BestInBagsPreviewClient() {
  return (
    <MockBagsContent
      initialStepId="inventory"
      parseError={null}
      profile={LANDING_PROFILE}
      setSimcInput={LANDING_NOOP}
      simcInput={LANDING_SIMC_INPUT_PREVIEW}
      specId={LANDING_SPEC_ID}
      specName={LANDING_SPEC_NAME}
    />
  );
}
