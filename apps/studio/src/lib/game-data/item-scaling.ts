import type { ItemScalingData } from "wowlab-common";

import type { GameDoc } from "./store";

import { getBulkRows, groupBulkBy, indexBulkBy } from "./bulk-store";
import { dedupeSortIds } from "./ids";
import { mapRowsByKey } from "./scaling-maps";

const cache = new Map<string, ItemScalingData>();

export function clearItemScalingCache(): void {
  cache.clear();
}

export function getItemScalingData(bonusIds: number[]): ItemScalingData {
  const sorted = dedupeSortIds(bonusIds);
  const key = sorted.join(",");
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const built = buildItemScalingData(sorted);

  cache.set(key, built);

  return built;
}

function buildItemScalingData(bonusIds: number[]): ItemScalingData {
  if (bonusIds.length === 0) {
    return {
      bonuses: new Map(),
      curve_points: new Map(),
      curves: new Map(),
      item_offset_curves: new Map(),
      item_scaling_configs: new Map(),
      item_squish_eras: new Map(),
      rand_prop_points: new Map(),
    } as ItemScalingData;
  }

  const offsetCurves = getBulkRows("item_offset_curves") as GameDoc[];
  const squishEras = getBulkRows("item_squish_eras") as GameDoc[];
  const bonuses = collectBonuses(bonusIds);
  const curveIds = collectCurveIds(bonuses, offsetCurves, squishEras);
  const { curvePoints, curves } = collectCurves(curveIds);

  return {
    bonuses,
    curve_points: curvePoints,
    curves,
    item_offset_curves: mapRowsByKey(offsetCurves, (row) => row.id as number),
    item_scaling_configs: mapRowsByKey(
      getBulkRows("item_scaling_configs") as GameDoc[],
      (row) => row.id as number,
    ),
    item_squish_eras: mapRowsByKey(squishEras, (row) => row.id as number),
    rand_prop_points: mapRowsByKey(
      getBulkRows("rand_prop_points") as GameDoc[],
      (row) => row.id as number,
    ),
  } as ItemScalingData;
}

function collectBonuses(bonusIds: number[]): Map<number, GameDoc[]> {
  const bonusesByParent = groupBulkBy(
    "item_bonuses",
    "parent_item_bonus_list_id",
  );
  const bonuses = new Map<number, GameDoc[]>();

  for (const id of bonusIds) {
    const rows = bonusesByParent.get(id) as GameDoc[] | undefined;

    if (rows) {
      bonuses.set(id, rows);
    }
  }

  return bonuses;
}

function collectCurveIds(
  bonuses: Map<number, GameDoc[]>,
  offsetCurves: GameDoc[],
  squishEras: GameDoc[],
): Set<number> {
  const curveIds = new Set<number>();

  for (const row of [...offsetCurves, ...squishEras]) {
    curveIds.add(row.curve_id as number);
  }

  for (const rows of bonuses.values()) {
    for (const bonus of rows) {
      for (const field of ["value_0", "value_1", "value_2", "value_3"]) {
        const value = bonus[field];

        if (typeof value === "number" && value > 0) {
          curveIds.add(value);
        }
      }
    }
  }

  return curveIds;
}

function collectCurves(curveIds: Set<number>): {
  curvePoints: Map<number, GameDoc[]>;
  curves: Map<number, GameDoc>;
} {
  const curvesById = indexBulkBy("curves", "id");
  const curvePointsByCurve = groupBulkBy("curve_points", "curve_id");
  const curves = new Map<number, GameDoc>();
  const curvePoints = new Map<number, GameDoc[]>();

  for (const id of curveIds) {
    const curve = curvesById.get(id) as GameDoc | undefined;

    if (curve) {
      curves.set(id, curve);
    }

    const points = curvePointsByCurve.get(id) as GameDoc[] | undefined;

    if (points) {
      curvePoints.set(
        id,
        [...points].sort(
          (a, b) => (a.order_index as number) - (b.order_index as number),
        ),
      );
    }
  }

  return { curvePoints, curves };
}
