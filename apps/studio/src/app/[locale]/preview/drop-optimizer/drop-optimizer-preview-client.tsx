"use client";

import { DropsContent } from "@/components/core/simulate/drops/drops-content";
import {
  LANDING_DROPS_SOURCES,
  LANDING_NOOP,
  LANDING_PROFILE,
  LANDING_SIMC_INPUT_PREVIEW,
  LANDING_SPEC_ID,
  LANDING_SPEC_NAME,
} from "@/components/shared/landing/__fixtures__/landing-fixtures";

export function DropOptimizerPreviewClient() {
  return (
    <DropsContent
      canSubmit
      initialStepId="sources"
      isSubmitting={false}
      onSimcInputChange={LANDING_NOOP}
      onSubmit={LANDING_NOOP}
      parseError={null}
      profile={LANDING_PROFILE}
      simcInput={LANDING_SIMC_INPUT_PREVIEW}
      sources={LANDING_DROPS_SOURCES}
      specId={LANDING_SPEC_ID}
      specName={LANDING_SPEC_NAME}
      submitError={null}
    />
  );
}
