"use client";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import {
  type RotationBrowseSpec,
  RotationsBrowseContent,
} from "./rotations-browse-content";
import { RotationsBrowseSkeleton } from "./rotations-browse-skeleton";

type RotationsBrowsePageProps = {
  isLoading: boolean;
  rotations: Row<"rotations">[];
  specs: RotationBrowseSpec[];
};

export function RotationsBrowsePage({
  isLoading,
  rotations,
  specs,
}: Readonly<RotationsBrowsePageProps>) {
  if (isLoading) {
    return <RotationsBrowseSkeleton />;
  }

  return <RotationsBrowseContent rotations={rotations} specs={specs} />;
}
