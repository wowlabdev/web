"use client";

import { RotationsBrowsePage } from "@/components/core/rotations";
import { useSpecList } from "@/lib/game-data";
import { useAllRotations } from "@/lib/query/services";

export default function RotationsBrowseRoute() {
  const { data: rotations, isLoading: rotationsLoading } = useAllRotations();
  const { data: specs } = useSpecList();

  return (
    <RotationsBrowsePage
      isLoading={rotationsLoading || !specs}
      rotations={rotations ?? []}
      specs={specs ?? []}
    />
  );
}
