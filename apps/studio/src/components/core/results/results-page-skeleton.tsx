import {
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";

export function ResultsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Skeleton className="h-8 w-28" />
      </div>

      <SkeletonCard className="mb-6" headerWidth="w-24">
        <Skeleton className="h-40 w-full" />
      </SkeletonCard>

      <SkeletonCard className="mb-6" headerWidth="w-16">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <SkeletonGrid count={4} cols={4} cellClassName="h-10" />
        </div>
      </SkeletonCard>

      <SkeletonCard className="mb-6" headerWidth="w-40">
        <SkeletonTable cols={["w-16", "w-24", "w-16", "w-12", "w-14"]} />
      </SkeletonCard>

      <SkeletonCard headerWidth="w-32">
        <SkeletonGrid count={2} cols={2} cellClassName="h-10" />
      </SkeletonCard>

      <SkeletonCard className="mt-6" headerWidth="w-32">
        <></>
      </SkeletonCard>
    </div>
  );
}
