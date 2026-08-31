import {
  Skeleton,
  SkeletonText,
} from "@wowlab/shared/components/common/skeleton-blocks";

import { LOOT_ROW_GRID } from "./loot-grid-layout";

export function LootGridRowSkeleton() {
  return (
    <div className={LOOT_ROW_GRID}>
      <div className="min-w-0">
        <div className="flex min-w-0 items-start gap-3">
          <Skeleton className="size-16 rounded-md" />
          <SkeletonText
            className="min-w-0 flex-1"
            lines={3}
            widths={["w-48", "w-64", "w-40"]}
          />
        </div>
      </div>

      <div className="min-w-0 space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>

      <SkeletonText
        className="min-w-0 grid grid-cols-2 gap-x-4 gap-y-1.5 space-y-0 2xl:grid-cols-1"
        lines={4}
        widths={["w-28", "w-24", "w-24", "w-28"]}
      />
    </div>
  );
}
