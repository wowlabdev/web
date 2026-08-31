"use client";

import {
  Skeleton,
  SkeletonField,
} from "@wowlab/shared/components/common/skeleton-blocks";

export function SimulateWizardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <div className="mt-4 space-y-4">
        <SkeletonField inputClassName="h-40" />
      </div>
    </div>
  );
}
