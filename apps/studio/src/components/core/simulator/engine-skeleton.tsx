"use client";

import { useIntlayer } from "next-intlayer";

import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

export function EngineSkeleton() {
  const content = useIntlayer("simulatorPage");

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="size-2 animate-pulse rounded-full bg-primary" />
        <span className="text-sm text-muted-foreground">
          {content.loadingEngine}
        </span>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
