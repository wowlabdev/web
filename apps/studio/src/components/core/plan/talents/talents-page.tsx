"use client";

import { NuqsIsland } from "@/components/shared/islands";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

import { TalentsContent } from "./talents-content";

export function TalentsPage() {
  return (
    <NuqsIsland fallback={<Skeleton className="h-[856px] w-full" />}>
      <TalentsContent />
    </NuqsIsland>
  );
}
