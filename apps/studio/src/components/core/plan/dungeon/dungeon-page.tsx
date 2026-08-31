"use client";

import { NuqsIsland } from "@/components/shared/islands";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

import { DungeonContent } from "./dungeon-content";

export function DungeonPage() {
  return (
    <NuqsIsland
      fallback={
        <Skeleton className="h-[calc(100vh-12rem)] min-h-[640px] w-full" />
      }
    >
      <DungeonContent />
    </NuqsIsland>
  );
}
