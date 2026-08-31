import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

export function UserProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-7 w-48" />
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
            >
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
