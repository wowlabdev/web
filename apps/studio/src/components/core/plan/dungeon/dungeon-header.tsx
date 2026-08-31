"use client";

import type { DungeonManifestEntry } from "@/lib/zod";

import { DungeonSelect } from "./components/dungeon-select";
import {
  type FilterDescriptor,
  FilterToolbar,
} from "./components/filter-toolbar";
import { FloorTabs } from "./components/floor-tabs";
import { ZoomTabs } from "./components/zoom-tabs";

type DungeonHeaderProps = {
  dungeon: DungeonManifestEntry;
  dungeonKey: string;
  dungeons: ReadonlyArray<DungeonManifestEntry>;
  filters: ReadonlyArray<FilterDescriptor>;
  floorIndex: number;
  floorMeta: DungeonManifestEntry["floors"][number];
  onDungeonChange: (key: string) => void;
  onFloorChange: (index: number) => void;
  onZoomChange: (zoom: number) => void;
  tileZoom: number;
};

export function DungeonHeader({
  dungeon,
  dungeonKey,
  dungeons,
  filters,
  floorIndex,
  floorMeta,
  onDungeonChange,
  onFloorChange,
  onZoomChange,
  tileZoom,
}: Readonly<DungeonHeaderProps>) {
  return (
    <header className="flex flex-wrap items-center gap-3">
      <DungeonSelect
        dungeons={dungeons}
        value={dungeonKey}
        onChange={onDungeonChange}
      />
      <FloorTabs
        dungeon={dungeon}
        floor={floorIndex}
        onChange={onFloorChange}
      />
      <ZoomTabs floor={floorMeta} tileZoom={tileZoom} onChange={onZoomChange} />
      <div className="ml-auto">
        <FilterToolbar filters={filters} />
      </div>
    </header>
  );
}
