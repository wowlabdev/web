import type { NodeObject, SceneObject } from "@/components/shared/canvas";

import {
  CONTENT_LAYER,
  ENEMY_NODE_RADIUS,
  ENEMY_OPACITY_DIMMED,
  ENEMY_OPACITY_FOCUSED,
  ENEMY_STROKE_WIDTH,
} from "@/components/core/plan/dungeon/constants";
import {
  ENEMY_FILL,
  ENEMY_STROKE,
} from "@/components/core/plan/dungeon/palette";
import { project } from "@/components/core/plan/dungeon/projection";
import { isFocused } from "@/components/core/plan/dungeon/pulls";

import type { DungeonSceneOptions } from "../types";

export function buildEnemyNodes(
  options: DungeonSceneOptions,
  packToPull: Map<number, number>,
): SceneObject[] {
  const { payload, tileZoom } = options;
  const objects: SceneObject[] = [];

  if (options.shouldHideEnemies) {
    return objects;
  }

  for (const enemy of payload.enemies) {
    if (typeof enemy.lat !== "number" || typeof enemy.lng !== "number") {
      continue;
    }

    const pos = project({ lat: enemy.lat, lng: enemy.lng }, tileZoom);
    const pullIndex = enemy.enemy_pack_id
      ? packToPull.get(enemy.enemy_pack_id)
      : undefined;
    const focused = isFocused(options.focusedPullIndex, pullIndex);

    objects.push({
      id: `enemy-${enemy.id}`,
      isSelectable: true,
      kind: "node",
      layerId: CONTENT_LAYER,
      metadata: {
        enemyId: enemy.id,
        npcId: enemy.npc_id,
        packId: enemy.enemy_pack_id,
        patrolId: enemy.enemy_patrol_id,
        pullIndex,
      },
      position: pos,
      style: {
        fill: ENEMY_FILL,
        opacity: focused ? ENEMY_OPACITY_FOCUSED : ENEMY_OPACITY_DIMMED,
        shape: "circle",
        size: ENEMY_NODE_RADIUS,
        stroke: ENEMY_STROKE,
        strokeWidth: ENEMY_STROKE_WIDTH,
      },
    } satisfies NodeObject);
  }

  return objects;
}
