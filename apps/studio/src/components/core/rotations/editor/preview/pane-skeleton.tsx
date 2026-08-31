"use client";

import { StatCardsSkeleton } from "@/components/core/rotations/stat-cards-skeleton";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

export function PaneSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-full" />
      <StatCardsSkeleton />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
