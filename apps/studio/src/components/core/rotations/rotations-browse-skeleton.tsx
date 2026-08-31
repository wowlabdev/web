import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";

import { StatCardsSkeleton } from "./stat-cards-skeleton";

export function RotationsBrowseSkeleton() {
  return (
    <div className="space-y-6">
      <StatCardsSkeleton />
      <div className="flex items-center justify-end">
        <Skeleton className="h-9 w-48" />
      </div>
      <SkeletonCard headerWidth="w-32">
        <SkeletonTable
          cols={["w-20", "w-32", "w-48", "w-16", "w-20"]}
          rows={6}
        />
      </SkeletonCard>
    </div>
  );
}
