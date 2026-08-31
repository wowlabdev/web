"use client";

import { RotationsBrowsePage } from "@/components/core/rotations/rotations-browse-page";
import {
  LANDING_ROTATIONS,
  LANDING_SPECS,
} from "@/components/shared/landing/__fixtures__/landing-fixtures";

export function RotationsPreviewClient() {
  return (
    <RotationsBrowsePage
      isLoading={false}
      rotations={LANDING_ROTATIONS}
      specs={LANDING_SPECS}
    />
  );
}
