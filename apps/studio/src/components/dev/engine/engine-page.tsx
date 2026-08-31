"use client";

import { WasmBoundary } from "@/components/shared/wasm";
import {
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";

import { EngineContent } from "./engine-content";

export function EnginePage() {
  return (
    <WasmBoundary fallback={<EngineSkeleton />}>
      <EngineContent />
    </WasmBoundary>
  );
}

function EngineSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-72" />
      <SkeletonGrid
        cols={3}
        count={3}
        cellClassName="h-32"
        gapClassName="gap-4"
      />
      <div className="space-y-4">
        <SkeletonCard headerWidth="w-32">
          <SkeletonTable cols={["w-32", "w-12", "w-12", "w-12"]} rows={4} />
        </SkeletonCard>
      </div>
    </div>
  );
}
