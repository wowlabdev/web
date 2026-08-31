import { StatGrid } from "@/components/shared/layout";
import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";

export function RankingsSpecsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-9 w-44" />
      </div>

      <StatGrid>
        {Array.from({ length: 3 }, (_, index) => (
          <SkeletonCard key={index} headerWidth="w-16">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </SkeletonCard>
        ))}
      </StatGrid>

      <SkeletonCard headerWidth="w-40">
        <SkeletonTable
          cols={["w-10", "w-32", "w-16", "w-16", "w-20", "w-28"]}
        />
      </SkeletonCard>
    </div>
  );
}
