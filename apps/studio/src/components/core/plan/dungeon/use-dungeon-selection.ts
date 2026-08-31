"use client";

import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useMemo } from "react";

import type { ObjectId } from "@/components/shared/canvas";
import type { DungeonManifestEntry } from "@/lib/zod";

import { DEFAULT_TILE_ZOOM } from "./constants";
import {
  pickDefaultSelection,
  type Selection,
} from "./dungeon-content-helpers";

export function useDungeonSelection(
  dungeons: ReadonlyArray<DungeonManifestEntry>,
) {
  const [dungeonKeyParam, setDungeonKeyParam] = useQueryState(
    "dungeon",
    parseAsString,
  );
  const [floorParam, setFloorParam] = useQueryState("floor", parseAsInteger);
  const [zoomParam, setZoomParam] = useQueryState("zoom", parseAsInteger);
  const [pullParam, setPullParam] = useQueryState("pull", parseAsInteger);
  const [selectedIdParam, setSelectedIdParam] = useQueryState(
    "selection",
    parseAsString,
  );
  const [hideEnemiesParam, setHideEnemiesParam] = useQueryState(
    "hideEnemies",
    parseAsBoolean.withDefault(false),
  );

  const defaultSelection = useMemo(
    () => pickDefaultSelection(dungeons),
    [dungeons],
  );

  const selection = useMemo<Selection | null>(() => {
    if (dungeonKeyParam !== null && floorParam !== null && zoomParam !== null) {
      return {
        dungeonKey: dungeonKeyParam,
        floor: floorParam,
        tileZoom: zoomParam,
      };
    }

    return defaultSelection;
  }, [dungeonKeyParam, floorParam, zoomParam, defaultSelection]);

  const focusedPullIndex = pullParam === null ? undefined : pullParam;
  const selectedId: ObjectId | null = selectedIdParam;
  const shouldHideEnemies = hideEnemiesParam;

  const handleDungeonChange = (key: string) => {
    const next = dungeons.find((d) => d.key === key);

    if (!next) {
      return;
    }

    const floors = next.floors.filter((f) => f.zoomLevels.length > 0);

    if (floors.length === 0) {
      return;
    }

    const f = floors.find((x) => x.isDefault) ?? floors[0];
    const z =
      f.zoomLevels.find((zl) => zl.zoom === DEFAULT_TILE_ZOOM) ??
      f.zoomLevels[0];

    setDungeonKeyParam(key);
    setFloorParam(f.index);
    setZoomParam(z.zoom);
    setPullParam(null);
    setSelectedIdParam(null);
  };

  const handleFloorChange = (index: number) => {
    if (!selection) {
      return;
    }

    const dungeon = dungeons.find((d) => d.key === selection.dungeonKey);

    if (!dungeon) {
      return;
    }

    const f = dungeon.floors.find((x) => x.index === index);

    if (!f || f.zoomLevels.length === 0) {
      return;
    }

    const z =
      f.zoomLevels.find((zl) => zl.zoom === selection.tileZoom) ??
      f.zoomLevels.find((zl) => zl.zoom === DEFAULT_TILE_ZOOM) ??
      f.zoomLevels[0];

    setDungeonKeyParam(selection.dungeonKey);
    setFloorParam(index);
    setZoomParam(z.zoom);
    setPullParam(null);
    setSelectedIdParam(null);
  };

  const handleZoomChange = (zoom: number) => {
    if (!selection) {
      return;
    }

    setDungeonKeyParam(selection.dungeonKey);
    setFloorParam(selection.floor);
    setZoomParam(zoom);
  };

  const handleSelect = (id: ObjectId | null) => {
    setSelectedIdParam(id);
  };

  const handleFocusPull = (idx?: number) => {
    setPullParam(idx === undefined ? null : idx);
  };

  const handleHideEnemiesToggle = (value: boolean) => {
    setHideEnemiesParam(value || null);
  };

  return {
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
  };
}
