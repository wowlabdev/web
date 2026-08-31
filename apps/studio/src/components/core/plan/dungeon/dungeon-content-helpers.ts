import type { DungeonManifestEntry } from "@/lib/zod";

import { DEFAULT_TILE_ZOOM } from "./constants";

export type Selection = {
  dungeonKey: string;
  floor: number;
  tileZoom: number;
};

export function pickDefaultSelection(
  dungeons: ReadonlyArray<DungeonManifestEntry>,
): Selection | null {
  for (const d of dungeons) {
    const floors = d.floors.filter((f) => f.hasData && f.zoomLevels.length > 0);

    if (floors.length === 0) {
      continue;
    }

    const floor = floors.find((f) => f.isDefault) ?? floors[0];
    const zoom =
      floor.zoomLevels.find((z) => z.zoom === DEFAULT_TILE_ZOOM) ??
      floor.zoomLevels[0];

    return { dungeonKey: d.key, floor: floor.index, tileZoom: zoom.zoom };
  }

  return null;
}
