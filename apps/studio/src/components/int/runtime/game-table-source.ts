import type { GameCollectionName } from "@/lib/game-data/store";
import type { BulkTableName } from "@wowlab/shared/lib/game-data/bulk-tables.generated";

import { makeGitHubSearchUrl } from "@wowlab/shared/lib/links";

export type GameTableName = BulkTableName | GameCollectionName;

const STRUCT_BY_TABLE: Record<GameTableName, string> = {
  classes: "ClassDataFlat",
  combat_ratings: "CombatRatingsFlat",
  combat_ratings_mult_by_ilvl: "CombatRatingsMultByIlvlFlat",
  curve_points: "CurvePointFlat",
  curves: "CurveFlat",
  enchantments: "EnchantmentFlat",
  expansion_traits: "ExpansionTraitTreeFlat",
  expected_stats: "ExpectedStatFlat",
  global_colors: "GlobalColorFlat",
  hp_per_sta: "HpPerStaFlat",
  item_bonuses: "ItemBonusFlat",
  item_damage_scaling: "ItemDamageScalingRow",
  item_drop_scaling: "ItemDropScalingFlat",
  item_offset_curves: "ItemOffsetCurveFlat",
  item_scaling_configs: "ItemScalingConfigFlat",
  item_squish_eras: "ItemSquishEraFlat",
  items_display: "ItemDataFlat",
  items_full: "ItemDataFlat",
  journal_instances: "JournalInstanceFlat",
  power_types: "PowerTypeFlat",
  rand_prop_points: "RandPropPointsFlat",
  specs: "SpecDataFlat",
  specs_traits: "TraitTreeFlat",
  spell_scaling: "SpellScalingFlat",
  spells_display: "SpellDataFlat",
  spells_full: "SpellDataFlat",
};

export function gameTableSourceUrl(name: GameTableName): string {
  return makeGitHubSearchUrl(
    `pub struct ${STRUCT_BY_TABLE[name]} language:rust`,
  );
}

export function gameTableStructName(name: GameTableName): string {
  return STRUCT_BY_TABLE[name];
}
