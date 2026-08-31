"use client";

import { useIntlayer } from "next-intlayer";

import {
  type CanvasScene,
  type ObjectId,
  PlannerCanvas,
  type SceneObject,
} from "@/components/shared/canvas";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { ScrollArea } from "@wowlab/shared/components/ui/scroll-area";

import type { FloorSummary } from "./scene/types";

import { Legend } from "./components/legend";
import { PullList } from "./components/pull-list";
import { SelectionPanel } from "./components/selection-panel";

type DungeonCanvasProps = {
  exportFileName: string;
  focusedPullIndex: number | undefined;
  onFocusPull: (index: number | undefined) => void;
  onSelect: (id: ObjectId | null) => void;
  payloadError: unknown;
  scene: CanvasScene | null;
  selectedId: ObjectId | null;
  selectedObject: SceneObject | null;
  summary: FloorSummary | null;
};

export function DungeonCanvas({
  exportFileName,
  focusedPullIndex,
  onFocusPull,
  onSelect,
  payloadError,
  scene,
  selectedId,
  selectedObject,
  summary,
}: Readonly<DungeonCanvasProps>) {
  const content = useIntlayer("plan");

  const sceneFallback = payloadError ? null : (
    <Skeleton className="absolute inset-0 h-full w-full" />
  );

  return (
    <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_18rem]">
      <div className="bg-muted/30 ring-1 ring-border relative h-full min-h-[480px] overflow-hidden">
        {payloadError ? (
          <div className="text-destructive border-destructive/40 absolute inset-x-3 top-3 z-10 border bg-background/90 p-3 text-xs">
            {content.dungeonFailedToLoad} {resolveErrorMessage(payloadError)}
          </div>
        ) : null}
        {scene ? (
          <PlannerCanvas
            scene={scene}
            selectedId={selectedId}
            onSelect={onSelect}
            annotationLayerId="dungeon:annotations"
            exportFileName={exportFileName}
          />
        ) : (
          sceneFallback
        )}
        <Legend />
      </div>

      <ScrollArea>
        <aside className="flex flex-col gap-3">
          <PullList
            pulls={summary?.pulls ?? []}
            focusedPullIndex={focusedPullIndex}
            onFocus={onFocusPull}
          />
          <SelectionPanel obj={selectedObject} />
        </aside>
      </ScrollArea>
    </div>
  );
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
