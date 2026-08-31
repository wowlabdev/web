import type {
  LabelObject,
  PolygonObject,
  SceneObject,
} from "@/components/shared/canvas";

import {
  CONTENT_LAYER,
  PACK_LABEL_FILL,
  PACK_LABEL_FONT_SIZE,
  PACK_LABEL_OFFSET_X,
  PACK_LABEL_OFFSET_Y,
  PACK_OPACITY_DIMMED,
  PACK_OPACITY_FOCUSED,
  PACK_STROKE_WIDTH_DIMMED,
  PACK_STROKE_WIDTH_FOCUSED,
} from "@/components/core/plan/dungeon/constants";
import { PACK_FILL, PACK_STROKE } from "@/components/core/plan/dungeon/palette";
import { project } from "@/components/core/plan/dungeon/projection";
import { colorForPull, isFocused } from "@/components/core/plan/dungeon/pulls";

import type { DungeonSceneOptions } from "../types";

export function buildPackPolygons(
  options: DungeonSceneOptions,
  packToPull: Map<number, number>,
): SceneObject[] {
  const { payload, tileZoom } = options;
  const objects: SceneObject[] = [];

  for (const pack of payload.packs) {
    const verts = pack.vertices;

    if (verts.length < 3) {
      continue;
    }

    const pts = verts.map((v) => project(v, tileZoom));
    const pullIndex = packToPull.get(pack.id);
    const focused = isFocused(options.focusedPullIndex, pullIndex);
    const color = pullIndex === undefined ? PACK_FILL : colorForPull(pullIndex);

    objects.push({
      id: `pack-${pack.id}`,
      isSelectable: true,
      kind: "polygon",
      layerId: CONTENT_LAYER,
      metadata: {
        group: pack.group,
        label: pack.label,
        packId: pack.id,
        pullIndex,
      },
      points: pts,
      style: {
        fill: color,
        opacity: focused ? PACK_OPACITY_FOCUSED : PACK_OPACITY_DIMMED,
        stroke: pullIndex === undefined ? PACK_STROKE : color,
        strokeWidth: focused
          ? PACK_STROKE_WIDTH_FOCUSED
          : PACK_STROKE_WIDTH_DIMMED,
      },
    } satisfies PolygonObject);

    if (pullIndex !== undefined && focused) {
      const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;

      objects.push({
        id: `pack-pull-label-${pack.id}`,
        kind: "label",
        layerId: CONTENT_LAYER,
        position: {
          x: cx + PACK_LABEL_OFFSET_X,
          y: cy + PACK_LABEL_OFFSET_Y,
        },
        style: { fill: PACK_LABEL_FILL, fontSize: PACK_LABEL_FONT_SIZE },
        text: String(pullIndex),
      } satisfies LabelObject);
    }
  }

  return objects;
}
