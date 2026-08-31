import {
  Skeleton,
  SkeletonCard,
  SkeletonList,
} from "@wowlab/shared/components/common/skeleton-blocks";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";

export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <StatCardGridSkeleton />
      <StatCardGridSkeleton />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <Skeleton className="h-5 w-28" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton className="h-8 w-24" key={index} />
            ))}
          </div>
        </CardHeader>
      </Card>
      <SkeletonCard headerWidth="w-40">
        <SkeletonList count={3} rowClassName="h-10" />
      </SkeletonCard>
    </div>
  );
}

function StatCardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="gap-4">
      <CardHeader className="flex items-center">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-8 w-12" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-36" />
      </CardContent>
    </Card>
  );
}
