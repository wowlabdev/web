"use client";

import {
  Skeleton,
  SkeletonText,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { Separator } from "@wowlab/shared/components/ui/separator";

export type GameTooltipSkeletonProps = {
  kind: "item" | "spell";
};

export function GameTooltipSkeleton({
  kind,
}: Readonly<GameTooltipSkeletonProps>) {
  return (
    <div className="w-72 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-xl">
      <div className="relative flex items-center gap-3 px-3 pt-3 pb-2.5">
        <Skeleton className="size-14 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-col gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex flex-col gap-1 px-3 pb-3">
        <Separator className="mb-2.5 bg-neutral-800" />
        {kind === "item" ? (
          <>
            <Skeleton className="h-4 w-16" />
            <SkeletonText
              lines={4}
              widths={["w-28", "w-24", "w-32", "w-20"]}
              lineClassName="h-3"
            />
          </>
        ) : (
          <SkeletonText
            lines={3}
            widths={["w-full", "w-11/12", "w-3/4"]}
            lineClassName="h-3"
          />
        )}
      </div>
    </div>
  );
}
