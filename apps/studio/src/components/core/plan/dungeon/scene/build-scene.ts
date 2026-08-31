import type { CanvasScene, SceneObject } from "@/components/shared/canvas";
import type { FloorPayload } from "@/lib/zod";

import type { DungeonSceneOptions, FloorSummary } from "./types";

import { LAYERS, TILE_H, TILE_W } from "../constants";
import { buildPullsFromGroups, colorForPull } from "../pulls";
import { buildEnemyNodes } from "./builders/enemies";
import { buildPackPolygons } from "./builders/packs";
import { buildPatrolPaths } from "./builders/patrols";

// Tiles are excluded here; they are memoized separately at the page level.
export function buildDungeonScene(options: DungeonSceneOptions): CanvasScene {
  const { dungeonKey, expansion, floor, payload, tile, tileZoom } = options;
  const objects: SceneObject[] = [];

  const pulls = buildPullsFromGroups(payload.packs);
  const packToPull = new Map<number, number>();

  for (const pull of pulls) {
    for (const pid of pull.packIds) {
      packToPull.set(pid, pull.index);
    }
  }

  objects.push(
    ...buildPackPolygons(options, packToPull),
    ...buildPatrolPaths(options),
    ...buildEnemyNodes(options, packToPull),
  );

  const fullBounds = {
    height: tile.rows * TILE_H,
    width: tile.cols * TILE_W,
    x: 0,
    y: 0,
  };

  return {
    bounds: fullBounds,
    id: `${expansion}-${dungeonKey}-f${floor}-z${tileZoom}`,
    layers: LAYERS,
    metadata: {
      dungeonKey,
      expansion,
      floor,
      tileZoom,
    },
    objects,
    panBounds: fullBounds,
  };
}

export function summarizeFloor(payload: FloorPayload): FloorSummary {
  const enemiesByPack = new Map<number, number>();

  for (const e of payload.enemies) {
    if (typeof e.enemy_pack_id !== "number") {
      continue;
    }

    enemiesByPack.set(
      e.enemy_pack_id,
      (enemiesByPack.get(e.enemy_pack_id) ?? 0) + 1,
    );
  }

  const pulls = buildPullsFromGroups(payload.packs).map((pull) => ({
    color: colorForPull(pull.index),
    enemyCount: pull.packIds.reduce(
      (s, id) => s + (enemiesByPack.get(id) ?? 0),
      0,
    ),
    index: pull.index,
    packIds: pull.packIds,
  }));

  return {
    pulls,
    totalEnemies: payload.enemies.length,
    totalPacks: payload.packs.length,
  };
}
