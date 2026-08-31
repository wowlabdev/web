import type { FloorPayload } from "@/lib/zod";

export type DungeonSceneOptions = {
  expansion: string;
  dungeonKey: string;
  floor: number;
  tileZoom: number;
  tile: FloorTileMeta;
  payload: FloorPayload;
  focusedPullIndex?: number;
  shouldHideEnemies?: boolean;
};

export type FloorSummary = {
  totalEnemies: number;
  totalPacks: number;
  pulls: ReadonlyArray<{
    index: number;
    color: string;
    packIds: ReadonlyArray<number>;
    enemyCount: number;
  }>;
};

export type FloorTileMeta = {
  zoom: number;
  cols: number;
  rows: number;
};
