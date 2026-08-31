"use client";

import { useIntlayer } from "next-intlayer";

import { WasmBoundary } from "@/components/shared/wasm";
import { useRotation } from "@/lib/query/services";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

import { RotationActionLists } from "./rotation-action-lists";
import { parseStoredRotation } from "./rotation-schema";
import { RotationViewHeader } from "./rotation-view-header";
import { RotationViewSkeleton } from "./rotation-view-skeleton";
import { RotationViewStats } from "./rotation-view-stats";

type RotationViewPageProps = {
  rotationId: string;
};

export function RotationViewPage({
  rotationId,
}: Readonly<RotationViewPageProps>) {
  const { data: rotation, isLoading } = useRotation(rotationId);
  const content = useIntlayer("rotations");

  if (isLoading) {
    return <RotationViewSkeleton />;
  }

  if (!rotation) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted-foreground text-sm">
          {content.notFound}
        </span>
      </div>
    );
  }

  const script = parseStoredRotation(rotation.script);
  const listNames = Object.keys(script.lists);
  const totalActions = listNames.reduce(
    (sum, name) => sum + script.lists[name].length,
    0,
  );

  return (
    <div className="space-y-6">
      <RotationViewHeader rotation={rotation} />

      <RotationViewStats
        listCount={listNames.length}
        rotation={rotation}
        totalActions={totalActions}
      />

      <WasmBoundary fallback={<Skeleton className="h-96 w-full" />}>
        <RotationActionLists
          listNames={listNames}
          rotation={rotation}
          script={script}
        />
      </WasmBoundary>
    </div>
  );
}
