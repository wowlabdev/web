import type { ImageObject, SceneObject } from "@/components/shared/canvas";

import {
  TILE_H,
  TILE_W,
  TILES_LAYER,
} from "@/components/core/plan/dungeon/constants";
import { makeCdnImageUrl, makeDungeonTileUrl } from "@wowlab/shared/lib/links";

import type { FloorTileMeta } from "../types";

export function buildTileLayer(opts: {
  tile: FloorTileMeta;
  tileZoom: number;
  dungeonKey: string;
  expansion: string;
  floor: number;
}): SceneObject[] {
  const { dungeonKey, expansion, floor, tile, tileZoom } = opts;
  const objects: SceneObject[] = [];

  for (let x = 0; x < tile.cols; x++) {
    for (let y = 0; y < tile.rows; y++) {
      objects.push({
        id: `tile-${tileZoom}-${x}-${y}`,
        imageUrl: makeCdnImageUrl(
          makeDungeonTileUrl(expansion, dungeonKey, floor, tileZoom, x, y),
          { width: TILE_W },
        ),
        kind: "image",
        layerId: TILES_LAYER,
        opacity: 1,
        position: { x: x * TILE_W, y: y * TILE_H },
        size: { height: TILE_H, width: TILE_W },
      } satisfies ImageObject);
    }
  }

  return objects;
}
