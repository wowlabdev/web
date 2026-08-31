import type { PathObject, SceneObject } from "@/components/shared/canvas";

import {
  CONTENT_LAYER,
  PATROL_OPACITY,
  PATROL_STROKE_WIDTH,
} from "@/components/core/plan/dungeon/constants";
import { PATROL_STROKE } from "@/components/core/plan/dungeon/palette";
import { project } from "@/components/core/plan/dungeon/projection";

import type { DungeonSceneOptions } from "../types";

export function buildPatrolPaths(options: DungeonSceneOptions): SceneObject[] {
  const { payload, tileZoom } = options;
  const objects: SceneObject[] = [];

  for (const patrol of payload.patrols) {
    if (!patrol.polyline) {
      continue;
    }

    const verts = patrol.polyline.vertices;

    if (verts.length < 2) {
      continue;
    }

    objects.push({
      id: `patrol-${patrol.id}`,
      kind: "path",
      layerId: CONTENT_LAYER,
      metadata: { patrolId: patrol.id },
      points: verts.map((v) => project(v, tileZoom)),
      style: {
        dash: "dashed",
        opacity: PATROL_OPACITY,
        stroke: PATROL_STROKE,
        strokeWidth: PATROL_STROKE_WIDTH,
      },
    } satisfies PathObject);
  }

  return objects;
}
