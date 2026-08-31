import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";

import { StatCardsSkeleton } from "./stat-cards-skeleton";

export function RotationViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-96" />
      </div>
      <StatCardsSkeleton />
      <SkeletonCard headerWidth="w-32">
        <SkeletonTable cols={["w-8", "w-24", "w-48"]} rows={5} />
      </SkeletonCard>
    </div>
  );
}
