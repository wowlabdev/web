import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>
    </div>
  );
}

function ChartCardSkeleton() {
  return (
    <Card className="gap-0">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-52 w-full" />
      </CardContent>
    </Card>
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
