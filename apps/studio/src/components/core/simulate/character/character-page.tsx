"use client";

import { WasmBoundary } from "@/components/shared/wasm";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

import { CharacterContent } from "./character-content";

export function CharacterPage() {
  return (
    <WasmBoundary fallback={<CharacterSkeleton />}>
      <CharacterContent />
    </WasmBoundary>
  );
}

export function CharacterSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-24 rounded-none" />
      <Skeleton className="h-96 rounded-none" />
    </div>
  );
}
