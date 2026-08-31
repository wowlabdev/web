import {
  getNumberField,
  groupRowsByKey,
  mapRowsByKey,
} from "@/lib/game-data/scaling-maps";

export type ScalingBundle = {
  bonuses: unknown[];
  combat_ratings: unknown[];
  combat_ratings_mult_by_ilvl: unknown[];
  curve_points: unknown[];
  curves: unknown[];
  hp_per_sta: unknown[];
  item_offset_curves: unknown[];
  item_scaling_configs: unknown[];
  item_squish_eras: unknown[];
  rand_prop_points: unknown[];
  spell_scaling: unknown[];
};

export type ScalingResolverData = {
  bonuses: Map<number, unknown[]>;
  combat_ratings: Map<number, unknown>;
  combat_ratings_mult_by_ilvl: Map<number, unknown>;
  curve_points: Map<number, unknown[]>;
  curves: Map<number, unknown>;
  hp_per_sta: Map<number, unknown>;
  item_offset_curves: Map<number, unknown>;
  item_scaling_configs: Map<number, unknown>;
  item_squish_eras: Map<number, unknown>;
  rand_prop_points: Map<number, unknown>;
  spell_scaling: Map<number, unknown>;
};

export function buildScalingResolverData(
  bundle: ScalingBundle,
): ScalingResolverData {
  const bonuses = groupRowsByNumberField(
    bundle.bonuses,
    "parent_item_bonus_list_id",
  );
  const curves = mapRowsByNumberField(bundle.curves, "id");
  const curve_points = groupRowsByNumberField(bundle.curve_points, "curve_id");

  for (const points of curve_points.values()) {
    points.sort(
      (a, b) =>
        getNumberField(a, "order_index") - getNumberField(b, "order_index"),
    );
  }

  const rand_prop_points = mapRowsByNumberField(bundle.rand_prop_points, "id");
  const item_scaling_configs = mapRowsByNumberField(
    bundle.item_scaling_configs,
    "id",
  );
  const item_offset_curves = mapRowsByNumberField(
    bundle.item_offset_curves,
    "id",
  );
  const item_squish_eras = mapRowsByNumberField(bundle.item_squish_eras, "id");
  const combat_ratings = mapRowsByNumberField(bundle.combat_ratings, "level");
  const hp_per_sta = mapRowsByNumberField(bundle.hp_per_sta, "level");
  const spell_scaling = mapRowsByNumberField(bundle.spell_scaling, "level");
  const combat_ratings_mult_by_ilvl = mapRowsByNumberField(
    bundle.combat_ratings_mult_by_ilvl,
    "item_level",
  );

  return {
    bonuses,
    combat_ratings,
    combat_ratings_mult_by_ilvl,
    curve_points,
    curves,
    hp_per_sta,
    item_offset_curves,
    item_scaling_configs,
    item_squish_eras,
    rand_prop_points,
    spell_scaling,
  };
}

function groupRowsByNumberField(
  rows: unknown[],
  key: string,
): Map<number, unknown[]> {
  return groupRowsByKey(rows, (row) => getNumberField(row, key));
}

function mapRowsByNumberField(
  rows: unknown[],
  key: string,
): Map<number, unknown> {
  return mapRowsByKey(rows, (row) => getNumberField(row, key));
}
