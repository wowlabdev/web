"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { indexObjects, type SceneObject } from "@/components/shared/canvas";
import { useDungeonManifest, useFloorPayload } from "@/lib/query/services";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

import type { FilterDescriptor } from "./components/filter-toolbar";
import type { FloorTileMeta } from "./scene/types";

import { DungeonCanvas } from "./dungeon-canvas";
import { DungeonHeader } from "./dungeon-header";
import { buildDungeonScene, summarizeFloor } from "./scene/build-scene";
import { buildTileLayer } from "./scene/builders/tiles";
import { useDungeonSelection } from "./use-dungeon-selection";

export function DungeonContent() {
  const content = useIntlayer("plan");
  const manifestQuery = useDungeonManifest();
  const dungeons = useMemo(
    () => manifestQuery.data?.dungeons ?? [],
    [manifestQuery.data],
  );

  const {
    focusedPullIndex,
    handleDungeonChange,
    handleFloorChange,
    handleFocusPull,
    handleHideEnemiesToggle,
    handleSelect,
    handleZoomChange,
    selectedId,
    selection,
    shouldHideEnemies,
  } = useDungeonSelection(dungeons);

  const dungeon = useMemo(
    () => dungeons.find((d) => d.key === selection?.dungeonKey) ?? null,
    [dungeons, selection?.dungeonKey],
  );
  const floor = useMemo(
    () => dungeon?.floors.find((f) => f.index === selection?.floor) ?? null,
    [dungeon, selection?.floor],
  );
  const tile = useMemo<FloorTileMeta | null>(
    () => floor?.zoomLevels.find((z) => z.zoom === selection?.tileZoom) ?? null,
    [floor, selection?.tileZoom],
  );

  const payloadQuery = useFloorPayload(
    selection?.dungeonKey ?? null,
    selection?.floor ?? null,
  );

  // Memoized separately from the dynamic scene so the tile pyramid survives selection/pull-focus/hide-enemies changes.
  const tileObjects = useMemo<ReadonlyArray<SceneObject>>(() => {
    if (!selection || !tile || !dungeon) {
      return [];
    }

    return buildTileLayer({
      dungeonKey: selection.dungeonKey,
      expansion: dungeon.expansion,
      floor: selection.floor,
      tile,
      tileZoom: selection.tileZoom,
    });
  }, [selection, tile, dungeon]);

  const scene = useMemo(() => {
    if (!selection || !tile || !payloadQuery.data) {
      return null;
    }

    const dynamicScene = buildDungeonScene({
      dungeonKey: selection.dungeonKey,
      expansion: dungeon?.expansion ?? "tww",
      floor: selection.floor,
      focusedPullIndex,
      payload: payloadQuery.data,
      shouldHideEnemies,
      tile,
      tileZoom: selection.tileZoom,
    });

    return {
      ...dynamicScene,
      objects: [...tileObjects, ...dynamicScene.objects],
    };
  }, [
    selection,
    dungeon,
    tile,
    payloadQuery.data,
    focusedPullIndex,
    shouldHideEnemies,
    tileObjects,
  ]);

  const summary = useMemo(
    () => (payloadQuery.data ? summarizeFloor(payloadQuery.data) : null),
    [payloadQuery.data],
  );

  const objectIndex = useMemo(
    () => (scene ? indexObjects(scene.objects) : null),
    [scene],
  );
  const selectedObject = useMemo(() => {
    if (!selectedId || !objectIndex) {
      return null;
    }

    return objectIndex.get(selectedId) ?? null;
  }, [objectIndex, selectedId]);

  const filters: ReadonlyArray<FilterDescriptor> = [
    {
      activeLabel: content.dungeonShowEnemies.value,
      id: "hide-enemies",
      isActive: shouldHideEnemies,
      label: content.dungeonHideEnemies.value,
      onToggle: () => handleHideEnemiesToggle(!shouldHideEnemies),
    },
    {
      id: "all-pulls",
      isActive: focusedPullIndex === undefined,
      label: content.dungeonAllPulls.value,
      onToggle: () => handleFocusPull(),
    },
  ];

  if (manifestQuery.isLoading) {
    return <Skeleton className="h-[calc(100vh-12rem)] min-h-[640px] w-full" />;
  }

  if (manifestQuery.error || !selection || !dungeon || !floor) {
    return (
      <div className="text-muted-foreground p-6 text-sm">
        {content.dungeonNoDataIntro}{" "}
        <code className="font-mono">pnpm sync:dungeons</code>{" "}
        {content.dungeonNoDataOutro}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[640px] flex-col gap-3">
      <DungeonHeader
        dungeon={dungeon}
        dungeonKey={selection.dungeonKey}
        dungeons={dungeons}
        filters={filters}
        floorIndex={selection.floor}
        floorMeta={floor}
        onDungeonChange={handleDungeonChange}
        onFloorChange={handleFloorChange}
        onZoomChange={handleZoomChange}
        tileZoom={selection.tileZoom}
      />

      <DungeonCanvas
        exportFileName={`route-${selection.dungeonKey}-f${selection.floor}-z${selection.tileZoom}.png`}
        focusedPullIndex={focusedPullIndex}
        onFocusPull={handleFocusPull}
        onSelect={handleSelect}
        payloadError={payloadQuery.error}
        scene={scene}
        selectedId={selectedId}
        selectedObject={selectedObject}
        summary={summary}
      />
    </div>
  );
}
