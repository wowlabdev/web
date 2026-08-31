import { z } from "zod";

export const ItemDropSourceSchema = z.object({
  difficulty_ids: z.array(z.number()).default([]),
  encounter_id: z.number(),
  encounter_name: z.string(),
  instance_id: z.number(),
  instance_name: z.string(),
});

export const ItemDropSourcesSchema = z.array(ItemDropSourceSchema);

export const JournalEncounterEntrySchema = z.object({
  creature_display_info_id: z.number().default(0),
  dungeon_encounter_id: z.number(),
  id: z.number(),
  image_file_data_id: z.number().default(0),
  image_storage_path: z.string().default(""),
  name: z.string(),
  order_index: z.number(),
  ui_map_id: z.number(),
  ui_model_scene_id: z.number().default(0),
});

export const JournalEncountersSchema = z.array(JournalEncounterEntrySchema);

export const SpellEffectSchema = z.object({
  amplitude: z.number(),
  aura: z.number(),
  base_points: z.number(),
  bonus_coefficient: z.number(),
  bonus_coefficient_from_ap: z.number(),
  chain_multiplier: z.number().optional(),
  chain_targets: z.number(),
  coefficient: z.number(),
  effect: z.number(),
  effect_attributes: z.number().optional(),
  effect_class_mask_1: z.number().optional(),
  effect_class_mask_2: z.number().optional(),
  effect_class_mask_3: z.number().optional(),
  effect_class_mask_4: z.number().optional(),
  implicit_target_a: z.number().optional(),
  implicit_target_b: z.number().optional(),
  index: z.number(),
  mechanic: z.number().optional(),
  misc_value_0: z.number(),
  misc_value_1: z.number(),
  period: z.number(),
  points_per_resource: z.number(),
  pvp_multiplier: z.number(),
  radius_max: z.number(),
  radius_min: z.number(),
  scaling_class: z.number().optional(),
  shapeshift_combat_round_time_ms: z.number().optional(),
  shapeshift_form_flags: z.number().optional(),
  trigger_spell: z.number(),
  variance: z.number(),
});

export const SpellEffectsSchema = z.array(SpellEffectSchema);

export type ItemDropSource = z.infer<typeof ItemDropSourceSchema>;

export type JournalEncounterEntry = z.infer<typeof JournalEncounterEntrySchema>;
