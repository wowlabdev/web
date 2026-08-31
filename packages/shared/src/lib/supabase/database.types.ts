export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  game: {
    Tables: {
      armor_location: {
        Row: {
          chain_modifier: number;
          cloth_modifier: number;
          id: number;
          leather_modifier: number;
          modifier: number;
          patch_version: string;
          plate_modifier: number;
          updated_at: string;
        };
        Insert: {
          chain_modifier?: number;
          cloth_modifier?: number;
          id: number;
          leather_modifier?: number;
          modifier?: number;
          patch_version: string;
          plate_modifier?: number;
          updated_at?: string;
        };
        Update: {
          chain_modifier?: number;
          cloth_modifier?: number;
          id?: number;
          leather_modifier?: number;
          modifier?: number;
          patch_version?: string;
          plate_modifier?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      armor_mitigation_by_lvl: {
        Row: {
          constant: number;
          level: number;
          patch_version: string;
        };
        Insert: {
          constant: number;
          level: number;
          patch_version: string;
        };
        Update: {
          constant?: number;
          level?: number;
          patch_version?: string;
        };
        Relationships: [];
      };
      base_mp: {
        Row: {
          adventurer: number;
          death_knight: number;
          demon_hunter: number;
          druid: number;
          evoker: number;
          hunter: number;
          level: number;
          mage: number;
          monk: number;
          paladin: number;
          patch_version: string;
          priest: number;
          rogue: number;
          shaman: number;
          traveler: number;
          warlock: number;
          warrior: number;
        };
        Insert: {
          adventurer: number;
          death_knight: number;
          demon_hunter: number;
          druid: number;
          evoker: number;
          hunter: number;
          level: number;
          mage: number;
          monk: number;
          paladin: number;
          patch_version: string;
          priest: number;
          rogue: number;
          shaman: number;
          traveler: number;
          warlock: number;
          warrior: number;
        };
        Update: {
          adventurer?: number;
          death_knight?: number;
          demon_hunter?: number;
          druid?: number;
          evoker?: number;
          hunter?: number;
          level?: number;
          mage?: number;
          monk?: number;
          paladin?: number;
          patch_version?: string;
          priest?: number;
          rogue?: number;
          shaman?: number;
          traveler?: number;
          warlock?: number;
          warrior?: number;
        };
        Relationships: [];
      };
      base_profession_ratings: {
        Row: {
          craft_speed_time_decrease: number;
          deftness_gather_time_decrease: number;
          finesse_gather_extra: number;
          inspiration_craft_crit: number;
          multicraft_craft_extra: number;
          patch_version: string;
          perception_gather_discover: number;
          profession: string;
          resourcefulness_reagent_reduction: number;
          unused_was_finesse_gather_time_increase: number;
          unused_was_perception_gather_range: number;
        };
        Insert: {
          craft_speed_time_decrease: number;
          deftness_gather_time_decrease: number;
          finesse_gather_extra: number;
          inspiration_craft_crit: number;
          multicraft_craft_extra: number;
          patch_version: string;
          perception_gather_discover: number;
          profession: string;
          resourcefulness_reagent_reduction: number;
          unused_was_finesse_gather_time_increase: number;
          unused_was_perception_gather_range: number;
        };
        Update: {
          craft_speed_time_decrease?: number;
          deftness_gather_time_decrease?: number;
          finesse_gather_extra?: number;
          inspiration_craft_crit?: number;
          multicraft_craft_extra?: number;
          patch_version?: string;
          perception_gather_discover?: number;
          profession?: string;
          resourcefulness_reagent_reduction?: number;
          unused_was_finesse_gather_time_increase?: number;
          unused_was_perception_gather_range?: number;
        };
        Relationships: [];
      };
      challenge_mode_damage: {
        Row: {
          challenge_level: number;
          patch_version: string;
          scalar: number;
        };
        Insert: {
          challenge_level: number;
          patch_version: string;
          scalar: number;
        };
        Update: {
          challenge_level?: number;
          patch_version?: string;
          scalar?: number;
        };
        Relationships: [];
      };
      challenge_mode_health: {
        Row: {
          challenge_level: number;
          patch_version: string;
          scalar: number;
        };
        Insert: {
          challenge_level: number;
          patch_version: string;
          scalar: number;
        };
        Update: {
          challenge_level?: number;
          patch_version?: string;
          scalar?: number;
        };
        Relationships: [];
      };
      challenge_mode_item_bonus_overrides: {
        Row: {
          dst_item_bonus_tree_id: number;
          id: number;
          item_bonus_tree_group_id: number;
          patch_version: string;
          required_time_event_not_passed: number;
          required_time_event_passed: number;
          src_item_bonus_tree_id: number;
          updated_at: string;
          value: number;
        };
        Insert: {
          dst_item_bonus_tree_id?: number;
          id: number;
          item_bonus_tree_group_id?: number;
          patch_version: string;
          required_time_event_not_passed?: number;
          required_time_event_passed?: number;
          src_item_bonus_tree_id?: number;
          updated_at?: string;
          value?: number;
        };
        Update: {
          dst_item_bonus_tree_id?: number;
          id?: number;
          item_bonus_tree_group_id?: number;
          patch_version?: string;
          required_time_event_not_passed?: number;
          required_time_event_passed?: number;
          src_item_bonus_tree_id?: number;
          updated_at?: string;
          value?: number;
        };
        Relationships: [];
      };
      content_tuning_x_difficulty: {
        Row: {
          content_tuning_id: number;
          difficulty_id: number;
          id: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          content_tuning_id?: number;
          difficulty_id?: number;
          id: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          content_tuning_id?: number;
          difficulty_id?: number;
          id?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      content_tuning_x_expected: {
        Row: {
          content_tuning_id: number;
          expected_stat_mod_id: number;
          id: number;
          max_mythic_plus_season_id: number;
          min_mythic_plus_season_id: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          content_tuning_id?: number;
          expected_stat_mod_id?: number;
          id: number;
          max_mythic_plus_season_id?: number;
          min_mythic_plus_season_id?: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          content_tuning_id?: number;
          expected_stat_mod_id?: number;
          id?: number;
          max_mythic_plus_season_id?: number;
          min_mythic_plus_season_id?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      content_tunings: {
        Row: {
          allowed_max_offset: number;
          allowed_min_offset: number;
          dmg_primary_stat_scaling_curve_id: number;
          dmg_scaling_curve_id: number;
          expansion_id: number;
          flags: number;
          hp_primary_stat_scaling_curve_id: number;
          hp_scaling_curve_id: number;
          id: number;
          ilevel: number;
          lfg_max_level: number;
          lfg_min_level: number;
          max_level_scaling_offset: number;
          max_level_squish: number;
          min_level_scaling_offset: number;
          min_level_squish: number;
          patch_version: string;
          primary_stat_scaling_mod_player_data_element_character_id: number;
          primary_stat_scaling_mod_player_data_element_character_multipli: number;
          updated_at: string;
          xp_mult_quest: number;
        };
        Insert: {
          allowed_max_offset?: number;
          allowed_min_offset?: number;
          dmg_primary_stat_scaling_curve_id?: number;
          dmg_scaling_curve_id?: number;
          expansion_id?: number;
          flags?: number;
          hp_primary_stat_scaling_curve_id?: number;
          hp_scaling_curve_id?: number;
          id: number;
          ilevel?: number;
          lfg_max_level?: number;
          lfg_min_level?: number;
          max_level_scaling_offset?: number;
          max_level_squish?: number;
          min_level_scaling_offset?: number;
          min_level_squish?: number;
          patch_version: string;
          primary_stat_scaling_mod_player_data_element_character_id?: number;
          primary_stat_scaling_mod_player_data_element_character_multipli?: number;
          updated_at?: string;
          xp_mult_quest?: number;
        };
        Update: {
          allowed_max_offset?: number;
          allowed_min_offset?: number;
          dmg_primary_stat_scaling_curve_id?: number;
          dmg_scaling_curve_id?: number;
          expansion_id?: number;
          flags?: number;
          hp_primary_stat_scaling_curve_id?: number;
          hp_scaling_curve_id?: number;
          id?: number;
          ilevel?: number;
          lfg_max_level?: number;
          lfg_min_level?: number;
          max_level_scaling_offset?: number;
          max_level_squish?: number;
          min_level_scaling_offset?: number;
          min_level_squish?: number;
          patch_version?: string;
          primary_stat_scaling_mod_player_data_element_character_id?: number;
          primary_stat_scaling_mod_player_data_element_character_multipli?: number;
          updated_at?: string;
          xp_mult_quest?: number;
        };
        Relationships: [];
      };
      creature_difficulties: {
        Row: {
          content_tuning_id: number;
          creature_id: number;
          faction_template_id: number;
          field_9_0_1_35522_003_max: number;
          field_9_0_1_35522_003_min: number;
          flags_0: number;
          flags_1: number;
          flags_2: number;
          flags_3: number;
          flags_4: number;
          flags_5: number;
          flags_6: number;
          flags_7: number;
          flags_8: number;
          id: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          content_tuning_id?: number;
          creature_id?: number;
          faction_template_id?: number;
          field_9_0_1_35522_003_max?: number;
          field_9_0_1_35522_003_min?: number;
          flags_0?: number;
          flags_1?: number;
          flags_2?: number;
          flags_3?: number;
          flags_4?: number;
          flags_5?: number;
          flags_6?: number;
          flags_7?: number;
          flags_8?: number;
          id: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          content_tuning_id?: number;
          creature_id?: number;
          faction_template_id?: number;
          field_9_0_1_35522_003_max?: number;
          field_9_0_1_35522_003_min?: number;
          flags_0?: number;
          flags_1?: number;
          flags_2?: number;
          flags_3?: number;
          flags_4?: number;
          flags_5?: number;
          flags_6?: number;
          flags_7?: number;
          flags_8?: number;
          id?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      creatures: {
        Row: {
          classification: number;
          creature_family: number;
          creature_type: number;
          id: number;
          name: string;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          classification?: number;
          creature_family?: number;
          creature_type?: number;
          id: number;
          name?: string;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          classification?: number;
          creature_family?: number;
          creature_type?: number;
          id?: number;
          name?: string;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          color: string;
          file_name: string;
          filename: string;
          icon_file_id: number;
          id: number;
          name: string;
          patch_version: string;
          primary_stat_priority: number;
          roles_mask: number;
          spell_class_set: number;
          updated_at: string | null;
        };
        Insert: {
          color?: string;
          file_name?: string;
          filename?: string;
          icon_file_id?: number;
          id: number;
          name: string;
          patch_version: string;
          primary_stat_priority?: number;
          roles_mask?: number;
          spell_class_set?: number;
          updated_at?: string | null;
        };
        Update: {
          color?: string;
          file_name?: string;
          filename?: string;
          icon_file_id?: number;
          id?: number;
          name?: string;
          patch_version?: string;
          primary_stat_priority?: number;
          roles_mask?: number;
          spell_class_set?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      combat_ratings: {
        Row: {
          armor_penetration: number;
          avoidance: number;
          block: number;
          corruption: number;
          corruption_resistance: number;
          crit_melee: number;
          crit_ranged: number;
          crit_spell: number;
          defense_skill: number;
          dodge: number;
          expertise: number;
          haste_melee: number;
          haste_ranged: number;
          haste_spell: number;
          hit_melee: number;
          hit_ranged: number;
          hit_spell: number;
          level: number;
          lifesteal: number;
          mastery: number;
          parry: number;
          patch_version: string;
          pvp_power: number;
          resilience_crit_taken: number;
          resilience_player_damage: number;
          speed: number;
          sturdiness: number;
          unused_0: number;
          unused_12: number;
          unused_27: number;
          unused_7: number;
          versatility_damage_done: number;
          versatility_damage_taken: number;
          versatility_healing_done: number;
        };
        Insert: {
          armor_penetration: number;
          avoidance: number;
          block: number;
          corruption: number;
          corruption_resistance: number;
          crit_melee: number;
          crit_ranged: number;
          crit_spell: number;
          defense_skill: number;
          dodge: number;
          expertise: number;
          haste_melee: number;
          haste_ranged: number;
          haste_spell: number;
          hit_melee: number;
          hit_ranged: number;
          hit_spell: number;
          level: number;
          lifesteal: number;
          mastery: number;
          parry: number;
          patch_version: string;
          pvp_power: number;
          resilience_crit_taken: number;
          resilience_player_damage: number;
          speed: number;
          sturdiness: number;
          unused_0: number;
          unused_12: number;
          unused_27: number;
          unused_7: number;
          versatility_damage_done: number;
          versatility_damage_taken: number;
          versatility_healing_done: number;
        };
        Update: {
          armor_penetration?: number;
          avoidance?: number;
          block?: number;
          corruption?: number;
          corruption_resistance?: number;
          crit_melee?: number;
          crit_ranged?: number;
          crit_spell?: number;
          defense_skill?: number;
          dodge?: number;
          expertise?: number;
          haste_melee?: number;
          haste_ranged?: number;
          haste_spell?: number;
          hit_melee?: number;
          hit_ranged?: number;
          hit_spell?: number;
          level?: number;
          lifesteal?: number;
          mastery?: number;
          parry?: number;
          patch_version?: string;
          pvp_power?: number;
          resilience_crit_taken?: number;
          resilience_player_damage?: number;
          speed?: number;
          sturdiness?: number;
          unused_0?: number;
          unused_12?: number;
          unused_27?: number;
          unused_7?: number;
          versatility_damage_done?: number;
          versatility_damage_taken?: number;
          versatility_healing_done?: number;
        };
        Relationships: [];
      };
      combat_ratings_mult_by_ilvl: {
        Row: {
          armor_multiplier: number;
          item_level: number;
          jewelry_multiplier: number;
          patch_version: string;
          trinket_multiplier: number;
          weapon_multiplier: number;
        };
        Insert: {
          armor_multiplier: number;
          item_level: number;
          jewelry_multiplier: number;
          patch_version: string;
          trinket_multiplier: number;
          weapon_multiplier: number;
        };
        Update: {
          armor_multiplier?: number;
          item_level?: number;
          jewelry_multiplier?: number;
          patch_version?: string;
          trinket_multiplier?: number;
          weapon_multiplier?: number;
        };
        Relationships: [];
      };
      cooldown_sets: {
        Row: {
          chr_specialization: number;
          id: number;
          patch_version: string;
          player_condition_id: number;
          spells: Json;
          updated_at: string;
        };
        Insert: {
          chr_specialization?: number;
          id: number;
          patch_version: string;
          player_condition_id?: number;
          spells?: Json;
          updated_at?: string;
        };
        Update: {
          chr_specialization?: number;
          id?: number;
          patch_version?: string;
          player_condition_id?: number;
          spells?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      crafted_products: {
        Row: {
          crafted_item_id: number;
          crafted_item_name: string;
          crafting_data_id: number;
          id: number;
          item_bonus_tree_id: number;
          patch_version: string;
          profession_enum_value: number;
          profession_id: number;
          profession_name: string;
          quality_item_id: number;
          quality_item_level: number;
          quality_item_name: string;
          quality_tier: number;
          updated_at: string;
        };
        Insert: {
          crafted_item_id?: number;
          crafted_item_name?: string;
          crafting_data_id?: number;
          id?: number;
          item_bonus_tree_id?: number;
          patch_version: string;
          profession_enum_value?: number;
          profession_id?: number;
          profession_name?: string;
          quality_item_id?: number;
          quality_item_level?: number;
          quality_item_name?: string;
          quality_tier?: number;
          updated_at?: string;
        };
        Update: {
          crafted_item_id?: number;
          crafted_item_name?: string;
          crafting_data_id?: number;
          id?: number;
          item_bonus_tree_id?: number;
          patch_version?: string;
          profession_enum_value?: number;
          profession_id?: number;
          profession_name?: string;
          quality_item_id?: number;
          quality_item_level?: number;
          quality_item_name?: string;
          quality_tier?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      currencies: {
        Row: {
          category_id: number;
          category_name: string;
          flags: number;
          icon_file_id: number;
          id: number;
          max_earnable_per_week: number;
          max_qty: number;
          name: string;
          order_index: number;
          patch_version: string;
          quality: number;
          updated_at: string;
        };
        Insert: {
          category_id?: number;
          category_name?: string;
          flags?: number;
          icon_file_id?: number;
          id: number;
          max_earnable_per_week?: number;
          max_qty?: number;
          name?: string;
          order_index?: number;
          patch_version: string;
          quality?: number;
          updated_at?: string;
        };
        Update: {
          category_id?: number;
          category_name?: string;
          flags?: number;
          icon_file_id?: number;
          id?: number;
          max_earnable_per_week?: number;
          max_qty?: number;
          name?: string;
          order_index?: number;
          patch_version?: string;
          quality?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      currency_categories: {
        Row: {
          expansion_id: number;
          flags: number;
          id: number;
          name: string;
          parent_category_id: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          expansion_id?: number;
          flags?: number;
          id: number;
          name?: string;
          parent_category_id?: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          expansion_id?: number;
          flags?: number;
          id?: number;
          name?: string;
          parent_category_id?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      curve_points: {
        Row: {
          curve_id: number;
          id: number;
          order_index: number;
          patch_version: string;
          pos_0: number;
          pos_1: number;
          pos_pre_squish_0: number;
          pos_pre_squish_1: number;
          updated_at: string;
        };
        Insert: {
          curve_id: number;
          id: number;
          order_index?: number;
          patch_version: string;
          pos_0?: number;
          pos_1?: number;
          pos_pre_squish_0?: number;
          pos_pre_squish_1?: number;
          updated_at?: string;
        };
        Update: {
          curve_id?: number;
          id?: number;
          order_index?: number;
          patch_version?: string;
          pos_0?: number;
          pos_1?: number;
          pos_pre_squish_0?: number;
          pos_pre_squish_1?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      curves: {
        Row: {
          flags: number;
          id: number;
          patch_version: string;
          type: number;
          updated_at: string;
        };
        Insert: {
          flags?: number;
          id: number;
          patch_version: string;
          type?: number;
          updated_at?: string;
        };
        Update: {
          flags?: number;
          id?: number;
          patch_version?: string;
          type?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      delves_seasons: {
        Row: {
          faction_id: number;
          id: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          faction_id?: number;
          id: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          faction_id?: number;
          id?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      difficulties: {
        Row: {
          flags: number;
          id: number;
          instance_type: number;
          item_context: number;
          kind: string;
          max_players: number;
          min_players: number;
          name: string;
          order_index: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          flags?: number;
          id: number;
          instance_type?: number;
          item_context?: number;
          kind?: string;
          max_players?: number;
          min_players?: number;
          name?: string;
          order_index?: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          flags?: number;
          id?: number;
          instance_type?: number;
          item_context?: number;
          kind?: string;
          max_players?: number;
          min_players?: number;
          name?: string;
          order_index?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      enchantments: {
        Row: {
          charges: number;
          condition_id: number;
          duration: number;
          effect_0: number;
          effect_1: number;
          effect_2: number;
          effect_arg_0: number;
          effect_arg_1: number;
          effect_arg_2: number;
          effect_points_min_0: number;
          effect_points_min_1: number;
          effect_points_min_2: number;
          effect_scaling_points_0: number;
          effect_scaling_points_1: number;
          effect_scaling_points_2: number;
          flags: number;
          icon_file_data_id: number;
          id: number;
          item_level: number;
          item_level_max: number;
          item_level_min: number;
          item_visual: number;
          max_level: number;
          min_level: number;
          name: string;
          patch_version: string;
          required_skill_id: number;
          required_skill_rank: number;
          scaling_class: number;
          scaling_class_restricted: number;
          transmog_cost: number;
          transmog_use_condition_id: number;
          updated_at: string;
        };
        Insert: {
          charges?: number;
          condition_id?: number;
          duration?: number;
          effect_0?: number;
          effect_1?: number;
          effect_2?: number;
          effect_arg_0?: number;
          effect_arg_1?: number;
          effect_arg_2?: number;
          effect_points_min_0?: number;
          effect_points_min_1?: number;
          effect_points_min_2?: number;
          effect_scaling_points_0?: number;
          effect_scaling_points_1?: number;
          effect_scaling_points_2?: number;
          flags?: number;
          icon_file_data_id?: number;
          id: number;
          item_level?: number;
          item_level_max?: number;
          item_level_min?: number;
          item_visual?: number;
          max_level?: number;
          min_level?: number;
          name?: string;
          patch_version: string;
          required_skill_id?: number;
          required_skill_rank?: number;
          scaling_class?: number;
          scaling_class_restricted?: number;
          transmog_cost?: number;
          transmog_use_condition_id?: number;
          updated_at?: string;
        };
        Update: {
          charges?: number;
          condition_id?: number;
          duration?: number;
          effect_0?: number;
          effect_1?: number;
          effect_2?: number;
          effect_arg_0?: number;
          effect_arg_1?: number;
          effect_arg_2?: number;
          effect_points_min_0?: number;
          effect_points_min_1?: number;
          effect_points_min_2?: number;
          effect_scaling_points_0?: number;
          effect_scaling_points_1?: number;
          effect_scaling_points_2?: number;
          flags?: number;
          icon_file_data_id?: number;
          id?: number;
          item_level?: number;
          item_level_max?: number;
          item_level_min?: number;
          item_visual?: number;
          max_level?: number;
          min_level?: number;
          name?: string;
          patch_version?: string;
          required_skill_id?: number;
          required_skill_rank?: number;
          scaling_class?: number;
          scaling_class_restricted?: number;
          transmog_cost?: number;
          transmog_use_condition_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      expected_stat_mods: {
        Row: {
          armor_constant_mod: number;
          creature_armor_mod: number;
          creature_auto_attack_dps_mod: number;
          creature_health_mod: number;
          creature_spell_damage_mod: number;
          id: number;
          patch_version: string;
          player_health_mod: number;
          player_mana_mod: number;
          player_primary_stat_mod: number;
          player_secondary_stat_mod: number;
          updated_at: string;
        };
        Insert: {
          armor_constant_mod?: number;
          creature_armor_mod?: number;
          creature_auto_attack_dps_mod?: number;
          creature_health_mod?: number;
          creature_spell_damage_mod?: number;
          id: number;
          patch_version: string;
          player_health_mod?: number;
          player_mana_mod?: number;
          player_primary_stat_mod?: number;
          player_secondary_stat_mod?: number;
          updated_at?: string;
        };
        Update: {
          armor_constant_mod?: number;
          creature_armor_mod?: number;
          creature_auto_attack_dps_mod?: number;
          creature_health_mod?: number;
          creature_spell_damage_mod?: number;
          id?: number;
          patch_version?: string;
          player_health_mod?: number;
          player_mana_mod?: number;
          player_primary_stat_mod?: number;
          player_secondary_stat_mod?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      expected_stats: {
        Row: {
          armor_constant: number;
          content_set_id: number;
          creature_armor: number;
          creature_auto_attack_dps: number;
          creature_health: number;
          creature_spell_damage: number;
          expansion_id: number;
          id: number;
          lvl: number;
          patch_version: string;
          player_health: number;
          player_mana: number;
          player_primary_stat: number;
          player_secondary_stat: number;
          updated_at: string;
        };
        Insert: {
          armor_constant?: number;
          content_set_id?: number;
          creature_armor?: number;
          creature_auto_attack_dps?: number;
          creature_health?: number;
          creature_spell_damage?: number;
          expansion_id?: number;
          id: number;
          lvl?: number;
          patch_version: string;
          player_health?: number;
          player_mana?: number;
          player_primary_stat?: number;
          player_secondary_stat?: number;
          updated_at?: string;
        };
        Update: {
          armor_constant?: number;
          content_set_id?: number;
          creature_armor?: number;
          creature_auto_attack_dps?: number;
          creature_health?: number;
          creature_spell_damage?: number;
          expansion_id?: number;
          id?: number;
          lvl?: number;
          patch_version?: string;
          player_health?: number;
          player_mana?: number;
          player_primary_stat?: number;
          player_secondary_stat?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      expansion_traits: {
        Row: {
          all_node_ids: number[];
          edges: Json;
          expansion_id: number;
          max_points: number;
          nodes: Json;
          patch_version: string;
          system: string;
          tree_id: number;
          updated_at: string;
        };
        Insert: {
          all_node_ids?: number[];
          edges?: Json;
          expansion_id: number;
          max_points?: number;
          nodes?: Json;
          patch_version: string;
          system: string;
          tree_id: number;
          updated_at?: string;
        };
        Update: {
          all_node_ids?: number[];
          edges?: Json;
          expansion_id?: number;
          max_points?: number;
          nodes?: Json;
          patch_version?: string;
          system?: string;
          tree_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      gem_properties: {
        Row: {
          enchant_id: number;
          id: number;
          patch_version: string;
          type: number;
          updated_at: string;
        };
        Insert: {
          enchant_id?: number;
          id: number;
          patch_version: string;
          type?: number;
          updated_at?: string;
        };
        Update: {
          enchant_id?: number;
          id?: number;
          patch_version?: string;
          type?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      global_colors: {
        Row: {
          color: string;
          id: number;
          name: string;
          patch_version: string;
          updated_at: string | null;
        };
        Insert: {
          color?: string;
          id: number;
          name: string;
          patch_version: string;
          updated_at?: string | null;
        };
        Update: {
          color?: string;
          id?: number;
          name?: string;
          patch_version?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      global_strings: {
        Row: {
          flags: number;
          id: number;
          patch_version: string;
          tag: string;
          updated_at: string | null;
          value: string;
        };
        Insert: {
          flags?: number;
          id: number;
          patch_version: string;
          tag: string;
          updated_at?: string | null;
          value?: string;
        };
        Update: {
          flags?: number;
          id?: number;
          patch_version?: string;
          tag?: string;
          updated_at?: string | null;
          value?: string;
        };
        Relationships: [];
      };
      hp_per_sta: {
        Row: {
          health: number;
          level: number;
          patch_version: string;
        };
        Insert: {
          health: number;
          level: number;
          patch_version: string;
        };
        Update: {
          health?: number;
          level?: number;
          patch_version?: string;
        };
        Relationships: [];
      };
      item_armor_quality: {
        Row: {
          id: number;
          patch_version: string;
          qualitymod_0: number;
          qualitymod_1: number;
          qualitymod_2: number;
          qualitymod_3: number;
          qualitymod_4: number;
          qualitymod_5: number;
          qualitymod_6: number;
          updated_at: string;
        };
        Insert: {
          id: number;
          patch_version: string;
          qualitymod_0?: number;
          qualitymod_1?: number;
          qualitymod_2?: number;
          qualitymod_3?: number;
          qualitymod_4?: number;
          qualitymod_5?: number;
          qualitymod_6?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          patch_version?: string;
          qualitymod_0?: number;
          qualitymod_1?: number;
          qualitymod_2?: number;
          qualitymod_3?: number;
          qualitymod_4?: number;
          qualitymod_5?: number;
          qualitymod_6?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_armor_shield: {
        Row: {
          id: number;
          item_level: number;
          patch_version: string;
          quality_0: number;
          quality_1: number;
          quality_2: number;
          quality_3: number;
          quality_4: number;
          quality_5: number;
          quality_6: number;
          updated_at: string;
        };
        Insert: {
          id: number;
          item_level?: number;
          patch_version: string;
          quality_0?: number;
          quality_1?: number;
          quality_2?: number;
          quality_3?: number;
          quality_4?: number;
          quality_5?: number;
          quality_6?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          item_level?: number;
          patch_version?: string;
          quality_0?: number;
          quality_1?: number;
          quality_2?: number;
          quality_3?: number;
          quality_4?: number;
          quality_5?: number;
          quality_6?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_armor_total: {
        Row: {
          cloth: number;
          id: number;
          item_level: number;
          leather: number;
          mail: number;
          patch_version: string;
          plate: number;
          updated_at: string;
        };
        Insert: {
          cloth?: number;
          id: number;
          item_level?: number;
          leather?: number;
          mail?: number;
          patch_version: string;
          plate?: number;
          updated_at?: string;
        };
        Update: {
          cloth?: number;
          id?: number;
          item_level?: number;
          leather?: number;
          mail?: number;
          patch_version?: string;
          plate?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_bonus_list_groups: {
        Row: {
          id: number;
          item_extended_cost_id: number;
          item_group_ilvl_scaling_id: number;
          item_logical_cost_group_id: number;
          patch_version: string;
          player_condition_id: number;
          sequence_spell_id: number;
          updated_at: string;
        };
        Insert: {
          id: number;
          item_extended_cost_id?: number;
          item_group_ilvl_scaling_id?: number;
          item_logical_cost_group_id?: number;
          patch_version: string;
          player_condition_id?: number;
          sequence_spell_id?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          item_extended_cost_id?: number;
          item_group_ilvl_scaling_id?: number;
          item_logical_cost_group_id?: number;
          patch_version?: string;
          player_condition_id?: number;
          sequence_spell_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_bonus_sequence_spells: {
        Row: {
          id: number;
          item_id: number;
          patch_version: string;
          spell_id: number;
          updated_at: string;
        };
        Insert: {
          id: number;
          item_id?: number;
          patch_version: string;
          spell_id?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          item_id?: number;
          patch_version?: string;
          spell_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_bonuses: {
        Row: {
          id: number;
          order_index: number;
          parent_item_bonus_list_id: number;
          patch_version: string;
          type: number;
          updated_at: string;
          value_0: number;
          value_1: number;
          value_2: number;
          value_3: number;
        };
        Insert: {
          id: number;
          order_index?: number;
          parent_item_bonus_list_id?: number;
          patch_version: string;
          type?: number;
          updated_at?: string;
          value_0?: number;
          value_1?: number;
          value_2?: number;
          value_3?: number;
        };
        Update: {
          id?: number;
          order_index?: number;
          parent_item_bonus_list_id?: number;
          patch_version?: string;
          type?: number;
          updated_at?: string;
          value_0?: number;
          value_1?: number;
          value_2?: number;
          value_3?: number;
        };
        Relationships: [];
      };
      item_conversions: {
        Row: {
          alternate_item_logical_cost_group_id: number;
          flags: number;
          id: number;
          item_bonus_tree_id: number;
          item_logical_cost_group_id: number;
          items: number[];
          patch_version: string;
          player_condition_id: number;
          updated_at: string;
        };
        Insert: {
          alternate_item_logical_cost_group_id?: number;
          flags?: number;
          id: number;
          item_bonus_tree_id?: number;
          item_logical_cost_group_id?: number;
          items?: number[];
          patch_version: string;
          player_condition_id?: number;
          updated_at?: string;
        };
        Update: {
          alternate_item_logical_cost_group_id?: number;
          flags?: number;
          id?: number;
          item_bonus_tree_id?: number;
          item_logical_cost_group_id?: number;
          items?: number[];
          patch_version?: string;
          player_condition_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_damage_scaling: {
        Row: {
          id: number;
          item_level: number;
          patch_version: string;
          quality_0: number;
          quality_1: number;
          quality_2: number;
          quality_3: number;
          quality_4: number;
          quality_5: number;
          quality_6: number;
          updated_at: string;
          weapon_type: string;
        };
        Insert: {
          id: number;
          item_level?: number;
          patch_version: string;
          quality_0?: number;
          quality_1?: number;
          quality_2?: number;
          quality_3?: number;
          quality_4?: number;
          quality_5?: number;
          quality_6?: number;
          updated_at?: string;
          weapon_type: string;
        };
        Update: {
          id?: number;
          item_level?: number;
          patch_version?: string;
          quality_0?: number;
          quality_1?: number;
          quality_2?: number;
          quality_3?: number;
          quality_4?: number;
          quality_5?: number;
          quality_6?: number;
          updated_at?: string;
          weapon_type?: string;
        };
        Relationships: [];
      };
      item_drop_scaling: {
        Row: {
          difficulty_key: string;
          flair_id: number;
          id: number;
          item_id: number;
          patch_version: string;
          source_kind: string;
          updated_at: string;
          upgrade_id: number;
        };
        Insert: {
          difficulty_key: string;
          flair_id?: number;
          id?: number;
          item_id?: number;
          patch_version: string;
          source_kind?: string;
          updated_at?: string;
          upgrade_id?: number;
        };
        Update: {
          difficulty_key?: string;
          flair_id?: number;
          id?: number;
          item_id?: number;
          patch_version?: string;
          source_kind?: string;
          updated_at?: string;
          upgrade_id?: number;
        };
        Relationships: [];
      };
      item_group_ilvl_scaling_entries: {
        Row: {
          conditional_cost_scaling: number;
          cost_scaling: number;
          currency_type_id: number;
          flags: number;
          id: number;
          item_group_ilvl_scaling_id: number;
          item_id: number;
          patch_version: string;
          player_condition_id: number;
          updated_at: string;
        };
        Insert: {
          conditional_cost_scaling?: number;
          cost_scaling?: number;
          currency_type_id?: number;
          flags?: number;
          id: number;
          item_group_ilvl_scaling_id?: number;
          item_id?: number;
          patch_version: string;
          player_condition_id?: number;
          updated_at?: string;
        };
        Update: {
          conditional_cost_scaling?: number;
          cost_scaling?: number;
          currency_type_id?: number;
          flags?: number;
          id?: number;
          item_group_ilvl_scaling_id?: number;
          item_id?: number;
          patch_version?: string;
          player_condition_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_level_selector_qualities: {
        Row: {
          id: number;
          parent_ils_quality_set_id: number;
          patch_version: string;
          quality: number;
          quality_item_bonus_list_id: number;
          updated_at: string;
        };
        Insert: {
          id: number;
          parent_ils_quality_set_id?: number;
          patch_version: string;
          quality?: number;
          quality_item_bonus_list_id?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          parent_ils_quality_set_id?: number;
          patch_version?: string;
          quality?: number;
          quality_item_bonus_list_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_level_selector_quality_sets: {
        Row: {
          id: number;
          ilvl_epic: number;
          ilvl_rare: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          ilvl_epic?: number;
          ilvl_rare?: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          ilvl_epic?: number;
          ilvl_rare?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_level_selectors: {
        Row: {
          azerite_unlock_mapping_set_id: number;
          id: number;
          item_level_selector_quality_set_id: number;
          min_item_level: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          azerite_unlock_mapping_set_id?: number;
          id: number;
          item_level_selector_quality_set_id?: number;
          min_item_level?: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          azerite_unlock_mapping_set_id?: number;
          id?: number;
          item_level_selector_quality_set_id?: number;
          min_item_level?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_offset_curves: {
        Row: {
          curve_id: number;
          curve_offset: number;
          id: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          curve_id?: number;
          curve_offset?: number;
          id: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          curve_id?: number;
          curve_offset?: number;
          id?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_scaling_configs: {
        Row: {
          flags: number;
          id: number;
          item_level: number;
          item_offset_curve_id: number;
          item_squish_era_id: number;
          patch_version: string;
          required_level: number;
          updated_at: string;
        };
        Insert: {
          flags?: number;
          id: number;
          item_level?: number;
          item_offset_curve_id?: number;
          item_squish_era_id?: number;
          patch_version: string;
          required_level?: number;
          updated_at?: string;
        };
        Update: {
          flags?: number;
          id?: number;
          item_level?: number;
          item_offset_curve_id?: number;
          item_squish_era_id?: number;
          patch_version?: string;
          required_level?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      item_socket_cost_per_level: {
        Row: {
          item_level: number;
          patch_version: string;
          socket_cost: number;
        };
        Insert: {
          item_level: number;
          patch_version: string;
          socket_cost: number;
        };
        Update: {
          item_level?: number;
          patch_version?: string;
          socket_cost?: number;
        };
        Relationships: [];
      };
      item_squish_eras: {
        Row: {
          curve_id: number;
          flags: number;
          id: number;
          patch: number;
          patch_version: string;
          updated_at: string;
        };
        Insert: {
          curve_id?: number;
          flags?: number;
          id: number;
          patch?: number;
          patch_version: string;
          updated_at?: string;
        };
        Update: {
          curve_id?: number;
          flags?: number;
          id?: number;
          patch?: number;
          patch_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
          allowable_class: number;
          allowable_race: number;
          binding: number;
          buy_price: number;
          class_id: number;
          classification: Json | null;
          description: string;
          dmg_variance: number;
          drop_sources: Json;
          effects: Json;
          expansion_id: number;
          file_name: string;
          flags: number[];
          gem_properties: number;
          id: number;
          inventory_type: number;
          item_level: number;
          item_set_id: number;
          max_count: number;
          modified_crafting_reagent_item_id: number;
          name: string;
          patch_version: string;
          quality: number;
          required_level: number;
          sell_price: number;
          set_info: Json | null;
          socket_bonus_enchant_id: number;
          sockets: number[];
          speed: number;
          stackable: number;
          stats: Json;
          subclass_id: number;
          updated_at: string;
        };
        Insert: {
          allowable_class?: number;
          allowable_race?: number;
          binding?: number;
          buy_price?: number;
          class_id?: number;
          classification?: Json | null;
          description?: string;
          dmg_variance?: number;
          drop_sources?: Json;
          effects?: Json;
          expansion_id?: number;
          file_name?: string;
          flags?: number[];
          gem_properties?: number;
          id: number;
          inventory_type?: number;
          item_level?: number;
          item_set_id?: number;
          max_count?: number;
          modified_crafting_reagent_item_id?: number;
          name: string;
          patch_version: string;
          quality?: number;
          required_level?: number;
          sell_price?: number;
          set_info?: Json | null;
          socket_bonus_enchant_id?: number;
          sockets?: number[];
          speed?: number;
          stackable?: number;
          stats?: Json;
          subclass_id?: number;
          updated_at?: string;
        };
        Update: {
          allowable_class?: number;
          allowable_race?: number;
          binding?: number;
          buy_price?: number;
          class_id?: number;
          classification?: Json | null;
          description?: string;
          dmg_variance?: number;
          drop_sources?: Json;
          effects?: Json;
          expansion_id?: number;
          file_name?: string;
          flags?: number[];
          gem_properties?: number;
          id?: number;
          inventory_type?: number;
          item_level?: number;
          item_set_id?: number;
          max_count?: number;
          modified_crafting_reagent_item_id?: number;
          name?: string;
          patch_version?: string;
          quality?: number;
          required_level?: number;
          sell_price?: number;
          set_info?: Json | null;
          socket_bonus_enchant_id?: number;
          sockets?: number[];
          speed?: number;
          stackable?: number;
          stats?: Json;
          subclass_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      journal_instances: {
        Row: {
          background_file_data_id: number;
          background_storage_path: string;
          button_file_data_id: number;
          button_small_file_data_id: number;
          button_storage_path: string;
          description: string;
          encounters: Json;
          id: number;
          is_current_season: boolean;
          is_mythic_plus: boolean;
          kind: string;
          loadscreen_file_data_id: number;
          loadscreen_seo_storage_path: string;
          loadscreen_storage_path: string;
          lore_file_data_id: number;
          lore_storage_path: string;
          map_id: number;
          name: string;
          patch_version: string;
          tier_id: number;
          tier_name: string;
          tier_order_index: number;
          updated_at: string;
        };
        Insert: {
          background_file_data_id?: number;
          background_storage_path?: string;
          button_file_data_id?: number;
          button_small_file_data_id?: number;
          button_storage_path?: string;
          description?: string;
          encounters?: Json;
          id: number;
          is_current_season?: boolean;
          is_mythic_plus?: boolean;
          kind?: string;
          loadscreen_file_data_id?: number;
          loadscreen_seo_storage_path?: string;
          loadscreen_storage_path?: string;
          lore_file_data_id?: number;
          lore_storage_path?: string;
          map_id?: number;
          name?: string;
          patch_version: string;
          tier_id?: number;
          tier_name?: string;
          tier_order_index?: number;
          updated_at?: string;
        };
        Update: {
          background_file_data_id?: number;
          background_storage_path?: string;
          button_file_data_id?: number;
          button_small_file_data_id?: number;
          button_storage_path?: string;
          description?: string;
          encounters?: Json;
          id?: number;
          is_current_season?: boolean;
          is_mythic_plus?: boolean;
          kind?: string;
          loadscreen_file_data_id?: number;
          loadscreen_seo_storage_path?: string;
          loadscreen_storage_path?: string;
          lore_file_data_id?: number;
          lore_storage_path?: string;
          map_id?: number;
          name?: string;
          patch_version?: string;
          tier_id?: number;
          tier_name?: string;
          tier_order_index?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      journal_tiers: {
        Row: {
          expansion: number;
          id: number;
          instances: Json;
          name: string;
          patch_version: string;
          player_condition_id: number;
          updated_at: string;
        };
        Insert: {
          expansion?: number;
          id: number;
          instances?: Json;
          name?: string;
          patch_version: string;
          player_condition_id?: number;
          updated_at?: string;
        };
        Update: {
          expansion?: number;
          id?: number;
          instances?: Json;
          name?: string;
          patch_version?: string;
          player_condition_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      meta: {
        Row: {
          id: number;
          patch_version: string;
          revision: number;
          synced_at: string;
          table_revisions: Json;
        };
        Insert: {
          id?: number;
          patch_version: string;
          revision: number;
          synced_at?: string;
          table_revisions?: Json;
        };
        Update: {
          id?: number;
          patch_version?: string;
          revision?: number;
          synced_at?: string;
          table_revisions?: Json;
        };
        Relationships: [];
      };
      mythic_plus_seasons: {
        Row: {
          bonus_list_groups: number[];
          crest_currencies: number[];
          delves_season_id: number;
          display_season_id: number;
          display_season_index: number;
          display_season_name: string;
          expansion_level: number;
          heroic_lfg_dungeon_min_gear: number;
          id: number;
          item_group_ilvl_scaling_id: number;
          key_floors: Json;
          key_rewards: Json;
          milestone_season: number;
          patch_version: string;
          start_time_event: number;
          tracked_affixes: Json;
          tracked_dungeons: Json;
          updated_at: string;
          valorstones_currency_id: number;
        };
        Insert: {
          bonus_list_groups?: number[];
          crest_currencies?: number[];
          delves_season_id?: number;
          display_season_id?: number;
          display_season_index?: number;
          display_season_name?: string;
          expansion_level?: number;
          heroic_lfg_dungeon_min_gear?: number;
          id: number;
          item_group_ilvl_scaling_id?: number;
          key_floors?: Json;
          key_rewards?: Json;
          milestone_season?: number;
          patch_version: string;
          start_time_event?: number;
          tracked_affixes?: Json;
          tracked_dungeons?: Json;
          updated_at?: string;
          valorstones_currency_id?: number;
        };
        Update: {
          bonus_list_groups?: number[];
          crest_currencies?: number[];
          delves_season_id?: number;
          display_season_id?: number;
          display_season_index?: number;
          display_season_name?: string;
          expansion_level?: number;
          heroic_lfg_dungeon_min_gear?: number;
          id?: number;
          item_group_ilvl_scaling_id?: number;
          key_floors?: Json;
          key_rewards?: Json;
          milestone_season?: number;
          patch_version?: string;
          start_time_event?: number;
          tracked_affixes?: Json;
          tracked_dungeons?: Json;
          updated_at?: string;
          valorstones_currency_id?: number;
        };
        Relationships: [];
      };
      npc_damage_by_class: {
        Row: {
          death_knight: number;
          demon_hunter: number;
          druid: number;
          hunter: number;
          level: number;
          mage: number;
          monk: number;
          paladin: number;
          patch_version: string;
          priest: number;
          rogue: number;
          shaman: number;
          warlock: number;
          warrior: number;
        };
        Insert: {
          death_knight: number;
          demon_hunter: number;
          druid: number;
          hunter: number;
          level: number;
          mage: number;
          monk: number;
          paladin: number;
          patch_version: string;
          priest: number;
          rogue: number;
          shaman: number;
          warlock: number;
          warrior: number;
        };
        Update: {
          death_knight?: number;
          demon_hunter?: number;
          druid?: number;
          hunter?: number;
          level?: number;
          mage?: number;
          monk?: number;
          paladin?: number;
          patch_version?: string;
          priest?: number;
          rogue?: number;
          shaman?: number;
          warlock?: number;
          warrior?: number;
        };
        Relationships: [];
      };
      npc_total_hp: {
        Row: {
          death_knight: number;
          demon_hunter: number;
          druid: number;
          hunter: number;
          level: number;
          mage: number;
          monk: number;
          paladin: number;
          patch_version: string;
          priest: number;
          rogue: number;
          shaman: number;
          warlock: number;
          warrior: number;
        };
        Insert: {
          death_knight: number;
          demon_hunter: number;
          druid: number;
          hunter: number;
          level: number;
          mage: number;
          monk: number;
          paladin: number;
          patch_version: string;
          priest: number;
          rogue: number;
          shaman: number;
          warlock: number;
          warrior: number;
        };
        Update: {
          death_knight?: number;
          demon_hunter?: number;
          druid?: number;
          hunter?: number;
          level?: number;
          mage?: number;
          monk?: number;
          paladin?: number;
          patch_version?: string;
          priest?: number;
          rogue?: number;
          shaman?: number;
          warlock?: number;
          warrior?: number;
        };
        Relationships: [];
      };
      power_types: {
        Row: {
          center_power: number;
          cost_global_string_tag: string;
          default_power: number;
          display_modifier: number;
          flags: number;
          id: number;
          max_base_power: number;
          min_power: number;
          name_global_string_tag: string;
          patch_version: string;
          power_type_enum: number;
          regen_combat: number;
          regen_interrupt_time_ms: number;
          regen_peace: number;
          updated_at: string;
        };
        Insert: {
          center_power?: number;
          cost_global_string_tag?: string;
          default_power?: number;
          display_modifier?: number;
          flags?: number;
          id: number;
          max_base_power?: number;
          min_power?: number;
          name_global_string_tag?: string;
          patch_version: string;
          power_type_enum?: number;
          regen_combat?: number;
          regen_interrupt_time_ms?: number;
          regen_peace?: number;
          updated_at?: string;
        };
        Update: {
          center_power?: number;
          cost_global_string_tag?: string;
          default_power?: number;
          display_modifier?: number;
          flags?: number;
          id?: number;
          max_base_power?: number;
          min_power?: number;
          name_global_string_tag?: string;
          patch_version?: string;
          power_type_enum?: number;
          regen_combat?: number;
          regen_interrupt_time_ms?: number;
          regen_peace?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      profession_ratings: {
        Row: {
          craft_speed_time_decrease: number;
          deftness_gather_time_decrease: number;
          expansion: string;
          finesse_gather_extra: number;
          ingenuity_concentration_refund_chance: number;
          inspiration_craft_crit: number;
          multicraft_craft_extra: number;
          patch_version: string;
          perception_gather_discover: number;
          resourcefulness_reagent_reduction: number;
          unused_was_perception_gather_range: number;
        };
        Insert: {
          craft_speed_time_decrease: number;
          deftness_gather_time_decrease: number;
          expansion: string;
          finesse_gather_extra: number;
          ingenuity_concentration_refund_chance: number;
          inspiration_craft_crit: number;
          multicraft_craft_extra: number;
          patch_version: string;
          perception_gather_discover: number;
          resourcefulness_reagent_reduction: number;
          unused_was_perception_gather_range: number;
        };
        Update: {
          craft_speed_time_decrease?: number;
          deftness_gather_time_decrease?: number;
          expansion?: string;
          finesse_gather_extra?: number;
          ingenuity_concentration_refund_chance?: number;
          inspiration_craft_crit?: number;
          multicraft_craft_extra?: number;
          patch_version?: string;
          perception_gather_discover?: number;
          resourcefulness_reagent_reduction?: number;
          unused_was_perception_gather_range?: number;
        };
        Relationships: [];
      };
      professions: {
        Row: {
          id: number;
          name: string;
          patch_version: string;
          profession_enum_value: number;
          skill_line_id: number;
          updated_at: string;
        };
        Insert: {
          id: number;
          name?: string;
          patch_version: string;
          profession_enum_value?: number;
          skill_line_id?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          patch_version?: string;
          profession_enum_value?: number;
          skill_line_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      pvp_seasons: {
        Row: {
          alliance_achievement_id: number;
          horde_achievement_id: number;
          id: number;
          milestone_season: number;
          patch_version: string;
          tier_rewards: Json;
          updated_at: string;
        };
        Insert: {
          alliance_achievement_id?: number;
          horde_achievement_id?: number;
          id: number;
          milestone_season?: number;
          patch_version: string;
          tier_rewards?: Json;
          updated_at?: string;
        };
        Update: {
          alliance_achievement_id?: number;
          horde_achievement_id?: number;
          id?: number;
          milestone_season?: number;
          patch_version?: string;
          tier_rewards?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      pvp_tiers: {
        Row: {
          bracket_id: number;
          id: number;
          max_rating: number;
          min_rating: number;
          name: string;
          next_tier: number;
          patch_version: string;
          prev_tier: number;
          rank: number;
          rank_icon: number;
          updated_at: string;
        };
        Insert: {
          bracket_id?: number;
          id: number;
          max_rating?: number;
          min_rating?: number;
          name?: string;
          next_tier?: number;
          patch_version: string;
          prev_tier?: number;
          rank?: number;
          rank_icon?: number;
          updated_at?: string;
        };
        Update: {
          bracket_id?: number;
          id?: number;
          max_rating?: number;
          min_rating?: number;
          name?: string;
          next_tier?: number;
          patch_version?: string;
          prev_tier?: number;
          rank?: number;
          rank_icon?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      rand_prop_points: {
        Row: {
          damage_replace_stat: number;
          damage_replace_stat_f: number;
          damage_secondary: number;
          damage_secondary_f: number;
          epic_0: number;
          epic_1: number;
          epic_2: number;
          epic_3: number;
          epic_4: number;
          epic_f_0: number;
          epic_f_1: number;
          epic_f_2: number;
          epic_f_3: number;
          epic_f_4: number;
          good_0: number;
          good_1: number;
          good_2: number;
          good_3: number;
          good_4: number;
          good_f_0: number;
          good_f_1: number;
          good_f_2: number;
          good_f_3: number;
          good_f_4: number;
          id: number;
          patch_version: string;
          superior_0: number;
          superior_1: number;
          superior_2: number;
          superior_3: number;
          superior_4: number;
          superior_f_0: number;
          superior_f_1: number;
          superior_f_2: number;
          superior_f_3: number;
          superior_f_4: number;
          updated_at: string;
        };
        Insert: {
          damage_replace_stat?: number;
          damage_replace_stat_f?: number;
          damage_secondary?: number;
          damage_secondary_f?: number;
          epic_0?: number;
          epic_1?: number;
          epic_2?: number;
          epic_3?: number;
          epic_4?: number;
          epic_f_0?: number;
          epic_f_1?: number;
          epic_f_2?: number;
          epic_f_3?: number;
          epic_f_4?: number;
          good_0?: number;
          good_1?: number;
          good_2?: number;
          good_3?: number;
          good_4?: number;
          good_f_0?: number;
          good_f_1?: number;
          good_f_2?: number;
          good_f_3?: number;
          good_f_4?: number;
          id: number;
          patch_version: string;
          superior_0?: number;
          superior_1?: number;
          superior_2?: number;
          superior_3?: number;
          superior_4?: number;
          superior_f_0?: number;
          superior_f_1?: number;
          superior_f_2?: number;
          superior_f_3?: number;
          superior_f_4?: number;
          updated_at?: string;
        };
        Update: {
          damage_replace_stat?: number;
          damage_replace_stat_f?: number;
          damage_secondary?: number;
          damage_secondary_f?: number;
          epic_0?: number;
          epic_1?: number;
          epic_2?: number;
          epic_3?: number;
          epic_4?: number;
          epic_f_0?: number;
          epic_f_1?: number;
          epic_f_2?: number;
          epic_f_3?: number;
          epic_f_4?: number;
          good_0?: number;
          good_1?: number;
          good_2?: number;
          good_3?: number;
          good_4?: number;
          good_f_0?: number;
          good_f_1?: number;
          good_f_2?: number;
          good_f_3?: number;
          good_f_4?: number;
          id?: number;
          patch_version?: string;
          superior_0?: number;
          superior_1?: number;
          superior_2?: number;
          superior_3?: number;
          superior_4?: number;
          superior_f_0?: number;
          superior_f_1?: number;
          superior_f_2?: number;
          superior_f_3?: number;
          superior_f_4?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      specialization_spells: {
        Row: {
          id: number;
          overrides_spell_id: number;
          patch_version: string;
          spec_id: number;
          spell_id: number;
          updated_at: string;
        };
        Insert: {
          id: number;
          overrides_spell_id?: number;
          patch_version: string;
          spec_id: number;
          spell_id: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          overrides_spell_id?: number;
          patch_version?: string;
          spec_id?: number;
          spell_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      specs: {
        Row: {
          class_id: number;
          class_name: string;
          description: string;
          file_name: string;
          icon_file_id: number;
          id: number;
          mastery_spell_id_0: number;
          mastery_spell_id_1: number;
          name: string;
          order_index: number;
          patch_version: string;
          primary_stat_priority: number;
          role: number;
          updated_at: string;
        };
        Insert: {
          class_id: number;
          class_name?: string;
          description?: string;
          file_name?: string;
          icon_file_id?: number;
          id: number;
          mastery_spell_id_0?: number;
          mastery_spell_id_1?: number;
          name: string;
          order_index?: number;
          patch_version: string;
          primary_stat_priority?: number;
          role?: number;
          updated_at?: string;
        };
        Update: {
          class_id?: number;
          class_name?: string;
          description?: string;
          file_name?: string;
          icon_file_id?: number;
          id?: number;
          mastery_spell_id_0?: number;
          mastery_spell_id_1?: number;
          name?: string;
          order_index?: number;
          patch_version?: string;
          primary_stat_priority?: number;
          role?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      specs_traits: {
        Row: {
          all_node_ids: number[];
          class_name: string;
          edges: Json;
          nodes: Json;
          patch_version: string;
          point_limits: Json;
          spec_id: number;
          spec_name: string;
          sub_trees: Json;
          tree_id: number;
          updated_at: string;
        };
        Insert: {
          all_node_ids?: number[];
          class_name: string;
          edges?: Json;
          nodes?: Json;
          patch_version: string;
          point_limits?: Json;
          spec_id: number;
          spec_name: string;
          sub_trees?: Json;
          tree_id: number;
          updated_at?: string;
        };
        Update: {
          all_node_ids?: number[];
          class_name?: string;
          edges?: Json;
          nodes?: Json;
          patch_version?: string;
          point_limits?: Json;
          spec_id?: number;
          spec_name?: string;
          sub_trees?: Json;
          tree_id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      spell_scaling: {
        Row: {
          adventurer: number;
          consumable: number;
          damage_replace_stat: number;
          damage_secondary: number;
          death_knight: number;
          demon_hunter: number;
          druid: number;
          evoker: number;
          gem1: number;
          gem2: number;
          gem3: number;
          health: number;
          hunter: number;
          item: number;
          level: number;
          mage: number;
          mana_consumable: number;
          monk: number;
          paladin: number;
          patch_version: string;
          priest: number;
          rogue: number;
          shaman: number;
          traveler: number;
          warlock: number;
          warrior: number;
        };
        Insert: {
          adventurer: number;
          consumable: number;
          damage_replace_stat: number;
          damage_secondary: number;
          death_knight: number;
          demon_hunter: number;
          druid: number;
          evoker: number;
          gem1: number;
          gem2: number;
          gem3: number;
          health: number;
          hunter: number;
          item: number;
          level: number;
          mage: number;
          mana_consumable: number;
          monk: number;
          paladin: number;
          patch_version: string;
          priest: number;
          rogue: number;
          shaman: number;
          traveler: number;
          warlock: number;
          warrior: number;
        };
        Update: {
          adventurer?: number;
          consumable?: number;
          damage_replace_stat?: number;
          damage_secondary?: number;
          death_knight?: number;
          demon_hunter?: number;
          druid?: number;
          evoker?: number;
          gem1?: number;
          gem2?: number;
          gem3?: number;
          health?: number;
          hunter?: number;
          item?: number;
          level?: number;
          mage?: number;
          mana_consumable?: number;
          monk?: number;
          paladin?: number;
          patch_version?: string;
          priest?: number;
          rogue?: number;
          shaman?: number;
          traveler?: number;
          warlock?: number;
          warrior?: number;
        };
        Relationships: [];
      };
      spells: {
        Row: {
          attributes: number[];
          aura_description: string;
          base_level: number;
          bonus_coefficient_from_ap: number;
          can_empower: boolean;
          cast_time: number;
          caster_aura_spell: number;
          caster_aura_state: number;
          charge_recovery_time: number;
          cone_degrees: number;
          defense_type: number;
          description: string;
          description_variables: string;
          dispel_type: number;
          duration: number;
          duration_hasted: boolean;
          effect_bonus_coefficient: number;
          effect_trigger_spell: number[];
          effects: Json;
          empower_stages: Json;
          equipped_item_requirement: Json | null;
          exclude_caster_aura_spell: number;
          exclude_caster_aura_state: number;
          exclude_target_aura_spell: number;
          exclude_target_aura_state: number;
          facing_caster_flags: number;
          file_name: string;
          hasted_ticks: boolean;
          id: number;
          implicit_target: number[];
          interrupt_aura_0: number;
          interrupt_aura_1: number;
          interrupt_channel_0: number;
          interrupt_channel_1: number;
          interrupt_flags: number;
          is_passive: boolean;
          knowledge_source: Json;
          labels: Json | null;
          learn_spells: Json;
          mana_cost: number;
          max_charges: number;
          max_duration: number;
          max_level: number;
          max_passive_aura_level: number;
          max_scaling_level: number;
          max_stacks: number;
          max_targets: number;
          min_scaling_level: number;
          name: string;
          pandemic_refresh: boolean;
          patch_version: string;
          periodic_type: string | null;
          power_costs: Json;
          proc_category_recovery_ms: number;
          proc_chance: number;
          proc_charges: number;
          proc_type_mask: number;
          radius_max: number;
          radius_min: number;
          range_max_0: number;
          range_max_1: number;
          range_min_0: number;
          range_min_1: number;
          recovery_time: number;
          refresh_behavior: string;
          replacement_spell_id: number;
          required_totem_category_0: number;
          required_totem_category_1: number;
          rolling_periodic: boolean;
          rppm_base_rate: number;
          rppm_flags: number;
          rppm_mods: Json;
          school_mask: number;
          shapeshift_exclude_0: number;
          shapeshift_exclude_1: number;
          shapeshift_mask_0: number;
          shapeshift_mask_1: number;
          speed: number;
          spell_class_mask_1: number;
          spell_class_mask_2: number;
          spell_class_mask_3: number;
          spell_class_mask_4: number;
          spell_class_set: number;
          spell_level: number;
          stance_bar_order: number;
          start_recovery_time: number;
          target_aura_spell: number;
          target_aura_state: number;
          target_flags: number;
          tick_may_crit: boolean;
          tick_on_application: boolean;
          tick_period_ms: number;
          totem_0: number;
          totem_1: number;
          updated_at: string;
        };
        Insert: {
          attributes?: number[];
          aura_description?: string;
          base_level?: number;
          bonus_coefficient_from_ap?: number;
          can_empower?: boolean;
          cast_time?: number;
          caster_aura_spell?: number;
          caster_aura_state?: number;
          charge_recovery_time?: number;
          cone_degrees?: number;
          defense_type?: number;
          description?: string;
          description_variables?: string;
          dispel_type?: number;
          duration?: number;
          duration_hasted?: boolean;
          effect_bonus_coefficient?: number;
          effect_trigger_spell?: number[];
          effects?: Json;
          empower_stages?: Json;
          equipped_item_requirement?: Json | null;
          exclude_caster_aura_spell?: number;
          exclude_caster_aura_state?: number;
          exclude_target_aura_spell?: number;
          exclude_target_aura_state?: number;
          facing_caster_flags?: number;
          file_name?: string;
          hasted_ticks?: boolean;
          id: number;
          implicit_target?: number[];
          interrupt_aura_0?: number;
          interrupt_aura_1?: number;
          interrupt_channel_0?: number;
          interrupt_channel_1?: number;
          interrupt_flags?: number;
          is_passive?: boolean;
          knowledge_source?: Json;
          labels?: Json | null;
          learn_spells?: Json;
          mana_cost?: number;
          max_charges?: number;
          max_duration?: number;
          max_level?: number;
          max_passive_aura_level?: number;
          max_scaling_level?: number;
          max_stacks?: number;
          max_targets?: number;
          min_scaling_level?: number;
          name: string;
          pandemic_refresh?: boolean;
          patch_version: string;
          periodic_type?: string | null;
          power_costs?: Json;
          proc_category_recovery_ms?: number;
          proc_chance?: number;
          proc_charges?: number;
          proc_type_mask?: number;
          radius_max?: number;
          radius_min?: number;
          range_max_0?: number;
          range_max_1?: number;
          range_min_0?: number;
          range_min_1?: number;
          recovery_time?: number;
          refresh_behavior?: string;
          replacement_spell_id?: number;
          required_totem_category_0?: number;
          required_totem_category_1?: number;
          rolling_periodic?: boolean;
          rppm_base_rate?: number;
          rppm_flags?: number;
          rppm_mods?: Json;
          school_mask?: number;
          shapeshift_exclude_0?: number;
          shapeshift_exclude_1?: number;
          shapeshift_mask_0?: number;
          shapeshift_mask_1?: number;
          speed?: number;
          spell_class_mask_1?: number;
          spell_class_mask_2?: number;
          spell_class_mask_3?: number;
          spell_class_mask_4?: number;
          spell_class_set?: number;
          spell_level?: number;
          stance_bar_order?: number;
          start_recovery_time?: number;
          target_aura_spell?: number;
          target_aura_state?: number;
          target_flags?: number;
          tick_may_crit?: boolean;
          tick_on_application?: boolean;
          tick_period_ms?: number;
          totem_0?: number;
          totem_1?: number;
          updated_at?: string;
        };
        Update: {
          attributes?: number[];
          aura_description?: string;
          base_level?: number;
          bonus_coefficient_from_ap?: number;
          can_empower?: boolean;
          cast_time?: number;
          caster_aura_spell?: number;
          caster_aura_state?: number;
          charge_recovery_time?: number;
          cone_degrees?: number;
          defense_type?: number;
          description?: string;
          description_variables?: string;
          dispel_type?: number;
          duration?: number;
          duration_hasted?: boolean;
          effect_bonus_coefficient?: number;
          effect_trigger_spell?: number[];
          effects?: Json;
          empower_stages?: Json;
          equipped_item_requirement?: Json | null;
          exclude_caster_aura_spell?: number;
          exclude_caster_aura_state?: number;
          exclude_target_aura_spell?: number;
          exclude_target_aura_state?: number;
          facing_caster_flags?: number;
          file_name?: string;
          hasted_ticks?: boolean;
          id?: number;
          implicit_target?: number[];
          interrupt_aura_0?: number;
          interrupt_aura_1?: number;
          interrupt_channel_0?: number;
          interrupt_channel_1?: number;
          interrupt_flags?: number;
          is_passive?: boolean;
          knowledge_source?: Json;
          labels?: Json | null;
          learn_spells?: Json;
          mana_cost?: number;
          max_charges?: number;
          max_duration?: number;
          max_level?: number;
          max_passive_aura_level?: number;
          max_scaling_level?: number;
          max_stacks?: number;
          max_targets?: number;
          min_scaling_level?: number;
          name?: string;
          pandemic_refresh?: boolean;
          patch_version?: string;
          periodic_type?: string | null;
          power_costs?: Json;
          proc_category_recovery_ms?: number;
          proc_chance?: number;
          proc_charges?: number;
          proc_type_mask?: number;
          radius_max?: number;
          radius_min?: number;
          range_max_0?: number;
          range_max_1?: number;
          range_min_0?: number;
          range_min_1?: number;
          recovery_time?: number;
          refresh_behavior?: string;
          replacement_spell_id?: number;
          required_totem_category_0?: number;
          required_totem_category_1?: number;
          rolling_periodic?: boolean;
          rppm_base_rate?: number;
          rppm_flags?: number;
          rppm_mods?: Json;
          school_mask?: number;
          shapeshift_exclude_0?: number;
          shapeshift_exclude_1?: number;
          shapeshift_mask_0?: number;
          shapeshift_mask_1?: number;
          speed?: number;
          spell_class_mask_1?: number;
          spell_class_mask_2?: number;
          spell_class_mask_3?: number;
          spell_class_mask_4?: number;
          spell_class_set?: number;
          spell_level?: number;
          stance_bar_order?: number;
          start_recovery_time?: number;
          target_aura_spell?: number;
          target_aura_state?: number;
          target_flags?: number;
          tick_may_crit?: boolean;
          tick_on_application?: boolean;
          tick_period_ms?: number;
          totem_0?: number;
          totem_1?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      stamina_mult_by_ilvl: {
        Row: {
          armor_multiplier: number;
          item_level: number;
          jewelry_multiplier: number;
          patch_version: string;
          trinket_multiplier: number;
          weapon_multiplier: number;
        };
        Insert: {
          armor_multiplier: number;
          item_level: number;
          jewelry_multiplier: number;
          patch_version: string;
          trinket_multiplier: number;
          weapon_multiplier: number;
        };
        Update: {
          armor_multiplier?: number;
          item_level?: number;
          jewelry_multiplier?: number;
          patch_version?: string;
          trinket_multiplier?: number;
          weapon_multiplier?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      boost_ledger: {
        Row: {
          created_at: string;
          delta: number;
          id: number;
          reason: string;
          source_event_id: string | null;
          source_transaction_id: string | null;
          supabase_user_id: string;
        };
        Insert: {
          created_at?: string;
          delta: number;
          id?: number;
          reason: string;
          source_event_id?: string | null;
          source_transaction_id?: string | null;
          supabase_user_id: string;
        };
        Update: {
          created_at?: string;
          delta?: number;
          id?: number;
          reason?: string;
          source_event_id?: string | null;
          source_transaction_id?: string | null;
          supabase_user_id?: string;
        };
        Relationships: [];
      };
      chunk_event_log: {
        Row: {
          claim_token: string | null;
          error: string | null;
          event_type: string;
          id: string;
          job_id: string | null;
          node_public_key: string | null;
          occurred_at: string;
        };
        Insert: {
          claim_token?: string | null;
          error?: string | null;
          event_type: string;
          id?: string;
          job_id?: string | null;
          node_public_key?: string | null;
          occurred_at?: string;
        };
        Update: {
          claim_token?: string | null;
          error?: string | null;
          event_type?: string;
          id?: string;
          job_id?: string | null;
          node_public_key?: string | null;
          occurred_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chunk_event_log_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chunk_event_log_node_public_key_fkey";
            columns: ["node_public_key"];
            isOneToOne: false;
            referencedRelation: "nodes";
            referencedColumns: ["public_key"];
          },
        ];
      };
      friend_list_members: {
        Row: {
          added_at: string;
          list_id: string;
          user_id: string;
        };
        Insert: {
          added_at?: string;
          list_id: string;
          user_id: string;
        };
        Update: {
          added_at?: string;
          list_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friend_list_members_list_id_fkey";
            columns: ["list_id"];
            isOneToOne: false;
            referencedRelation: "friend_lists";
            referencedColumns: ["id"];
          },
        ];
      };
      friend_lists: {
        Row: {
          created_at: string;
          id: string;
          invite_code: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invite_code?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          invite_code?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          meta: Json;
          result_pb: string | null;
          sentinel_config: string;
          sim_config: string;
          status: Database["public"]["Enums"]["job_status"];
          timeline_pb: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          meta?: Json;
          result_pb?: string | null;
          sentinel_config?: string;
          sim_config?: string;
          status?: Database["public"]["Enums"]["job_status"];
          timeline_pb?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          meta?: Json;
          result_pb?: string | null;
          sentinel_config?: string;
          sim_config?: string;
          status?: Database["public"]["Enums"]["job_status"];
          timeline_pb?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      nodes: {
        Row: {
          created_at: string;
          last_seen_at: string | null;
          max_parallel: number;
          name: string;
          platform: string;
          public_key: string;
          status: string;
          total_cores: number;
          user_id: string | null;
          version: string;
        };
        Insert: {
          created_at?: string;
          last_seen_at?: string | null;
          max_parallel?: number;
          name?: string;
          platform?: string;
          public_key: string;
          status?: string;
          total_cores?: number;
          user_id?: string | null;
          version?: string;
        };
        Update: {
          created_at?: string;
          last_seen_at?: string | null;
          max_parallel?: number;
          name?: string;
          platform?: string;
          public_key?: string;
          status?: string;
          total_cores?: number;
          user_id?: string | null;
          version?: string;
        };
        Relationships: [];
      };
      nodes_permissions: {
        Row: {
          access_type: string;
          created_at: string;
          public_key: string;
          target_id: string;
        };
        Insert: {
          access_type: string;
          created_at?: string;
          public_key: string;
          target_id?: string;
        };
        Update: {
          access_type?: string;
          created_at?: string;
          public_key?: string;
          target_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nodes_permissions_public_key_fkey";
            columns: ["public_key"];
            isOneToOne: false;
            referencedRelation: "nodes";
            referencedColumns: ["public_key"];
          },
        ];
      };
      paddle_customers: {
        Row: {
          created_at: string;
          email: string | null;
          paddle_customer_id: string;
          supabase_user_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          paddle_customer_id: string;
          supabase_user_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          paddle_customer_id?: string;
          supabase_user_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      paddle_processed_events: {
        Row: {
          event_id: string;
          event_type: string;
          occurred_at: string;
          processed_at: string;
        };
        Insert: {
          event_id: string;
          event_type: string;
          occurred_at: string;
          processed_at?: string;
        };
        Update: {
          event_id?: string;
          event_type?: string;
          occurred_at?: string;
          processed_at?: string;
        };
        Relationships: [];
      };
      paperdolls: {
        Row: {
          character_name: string | null;
          simc: string;
          spec_id: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          character_name?: string | null;
          simc: string;
          spec_id: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          character_name?: string | null;
          simc?: string;
          spec_id?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      rotations: {
        Row: {
          checksum: string | null;
          created_at: string;
          current_version: number;
          description: string | null;
          forked_from_id: string | null;
          id: string;
          is_public: boolean;
          name: string;
          script: Json;
          slug: string;
          spec_id: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          checksum?: string | null;
          created_at?: string;
          current_version?: number;
          description?: string | null;
          forked_from_id?: string | null;
          id?: string;
          is_public?: boolean;
          name: string;
          script: Json;
          slug: string;
          spec_id: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          checksum?: string | null;
          created_at?: string;
          current_version?: number;
          description?: string | null;
          forked_from_id?: string | null;
          id?: string;
          is_public?: boolean;
          name?: string;
          script?: Json;
          slug?: string;
          spec_id?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rotations_forked_from_id_fkey";
            columns: ["forked_from_id"];
            isOneToOne: false;
            referencedRelation: "rotations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rotations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      rotations_versions: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          message: string | null;
          rotation_id: string;
          script: Json;
          version: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          message?: string | null;
          rotation_id: string;
          script: Json;
          version: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          message?: string | null;
          rotation_id?: string;
          script?: Json;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "rotations_versions_rotation_id_fkey";
            columns: ["rotation_id"];
            isOneToOne: false;
            referencedRelation: "rotations";
            referencedColumns: ["id"];
          },
        ];
      };
      sentinel_notification_subscriptions: {
        Row: {
          channel_id: string;
          created_at: string | null;
          created_by: string | null;
          event_type: string;
          guild_id: string;
          id: string;
        };
        Insert: {
          channel_id: string;
          created_at?: string | null;
          created_by?: string | null;
          event_type: string;
          guild_id: string;
          id?: string;
        };
        Update: {
          channel_id?: string;
          created_at?: string | null;
          created_by?: string | null;
          event_type?: string;
          guild_id?: string;
          id?: string;
        };
        Relationships: [];
      };
      short_urls: {
        Row: {
          created_at: string;
          slug: string;
          target_url: string;
        };
        Insert: {
          created_at?: string;
          slug: string;
          target_url: string;
        };
        Update: {
          created_at?: string;
          slug?: string;
          target_url?: string;
        };
        Relationships: [];
      };
      sim_profiles: {
        Row: {
          category: string;
          description: string;
          id: string;
          label: string;
          order: number;
        };
        Insert: {
          category: string;
          description: string;
          id: string;
          label: string;
          order?: number;
        };
        Update: {
          category?: string;
          description?: string;
          id?: string;
          label?: string;
          order?: number;
        };
        Relationships: [];
      };
      sim_rankings: {
        Row: {
          job_id: string;
          rank: number;
          score: number;
          season_id: string;
          spec_id: number;
          updated_at: string;
        };
        Insert: {
          job_id: string;
          rank: number;
          score: number;
          season_id: string;
          spec_id: number;
          updated_at?: string;
        };
        Update: {
          job_id?: string;
          rank?: number;
          score?: number;
          season_id?: string;
          spec_id?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sim_rankings_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      sim_rankings_snapshots: {
        Row: {
          job_id: string;
          rank: number;
          score: number;
          season_id: string;
          snapshot_at: string;
          spec_id: number;
        };
        Insert: {
          job_id: string;
          rank: number;
          score: number;
          season_id: string;
          snapshot_at: string;
          spec_id: number;
        };
        Update: {
          job_id?: string;
          rank?: number;
          score?: number;
          season_id?: string;
          snapshot_at?: string;
          spec_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "sim_rankings_snapshots_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      sim_rollups_daily: {
        Row: {
          day: string;
          jobs_count: number;
          max_dps: number;
          mean_dps: number;
          min_dps: number;
          season_id: string;
          spec_id: number;
          std_dps: number;
        };
        Insert: {
          day: string;
          jobs_count: number;
          max_dps: number;
          mean_dps: number;
          min_dps: number;
          season_id: string;
          spec_id: number;
          std_dps: number;
        };
        Update: {
          day?: string;
          jobs_count?: number;
          max_dps?: number;
          mean_dps?: number;
          min_dps?: number;
          season_id?: string;
          spec_id?: number;
          std_dps?: number;
        };
        Relationships: [];
      };
      sim_rollups_rolling: {
        Row: {
          anchor_day: string;
          jobs_count: number;
          max_dps: number;
          mean_dps: number;
          min_dps: number;
          season_id: string;
          spec_id: number;
          std_dps: number;
          window_days: number;
        };
        Insert: {
          anchor_day: string;
          jobs_count: number;
          max_dps: number;
          mean_dps: number;
          min_dps: number;
          season_id: string;
          spec_id: number;
          std_dps: number;
          window_days: number;
        };
        Update: {
          anchor_day?: string;
          jobs_count?: number;
          max_dps?: number;
          mean_dps?: number;
          min_dps?: number;
          season_id?: string;
          spec_id?: number;
          std_dps?: number;
          window_days?: number;
        };
        Relationships: [];
      };
      sim_seasons: {
        Row: {
          created_at: string;
          ends_at: string | null;
          is_active: boolean;
          ruleset_version: number;
          season_id: string;
          starts_at: string;
        };
        Insert: {
          created_at?: string;
          ends_at?: string | null;
          is_active?: boolean;
          ruleset_version: number;
          season_id: string;
          starts_at: string;
        };
        Update: {
          created_at?: string;
          ends_at?: string | null;
          is_active?: boolean;
          ruleset_version?: number;
          season_id?: string;
          starts_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          canceled_at: string | null;
          created_at: string;
          current_period_ends_at: string | null;
          current_period_starts_at: string | null;
          next_billed_at: string | null;
          occurred_at: string;
          paddle_customer_id: string;
          paddle_subscription_id: string;
          plan: string;
          quantity: number;
          scheduled_change_action: string | null;
          scheduled_change_effective_at: string | null;
          scheduled_change_resume_at: string | null;
          status: string;
          supabase_user_id: string | null;
          updated_at: string;
        };
        Insert: {
          canceled_at?: string | null;
          created_at?: string;
          current_period_ends_at?: string | null;
          current_period_starts_at?: string | null;
          next_billed_at?: string | null;
          occurred_at: string;
          paddle_customer_id: string;
          paddle_subscription_id: string;
          plan: string;
          quantity?: number;
          scheduled_change_action?: string | null;
          scheduled_change_effective_at?: string | null;
          scheduled_change_resume_at?: string | null;
          status: string;
          supabase_user_id?: string | null;
          updated_at?: string;
        };
        Update: {
          canceled_at?: string | null;
          created_at?: string;
          current_period_ends_at?: string | null;
          current_period_starts_at?: string | null;
          next_billed_at?: string | null;
          occurred_at?: string;
          paddle_customer_id?: string;
          paddle_subscription_id?: string;
          plan?: string;
          quantity?: number;
          scheduled_change_action?: string | null;
          scheduled_change_effective_at?: string | null;
          scheduled_change_resume_at?: string | null;
          status?: string;
          supabase_user_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_activities: {
        Row: {
          items: Json;
          seen_at: string;
          user_id: string;
        };
        Insert: {
          items?: Json;
          seen_at?: string;
          user_id: string;
        };
        Update: {
          items?: Json;
          seen_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          handle: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          handle: string;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          handle?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_reserved_handles: {
        Row: {
          created_at: string;
          handle: string;
          reason: string;
        };
        Insert: {
          created_at?: string;
          handle: string;
          reason: string;
        };
        Update: {
          created_at?: string;
          handle?: string;
          reason?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: number;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          ai_key_secret_id: string | null;
          ai_model: string | null;
          ai_provider: string | null;
          compact_mode: boolean;
          created_at: string;
          default_fight_duration: number;
          default_iterations: number;
          id: string;
          mcp_servers: Json;
          show_tooltips: boolean;
          theme: string;
          token_api: string;
          token_claim: string;
          updated_at: string;
        };
        Insert: {
          ai_key_secret_id?: string | null;
          ai_model?: string | null;
          ai_provider?: string | null;
          compact_mode?: boolean;
          created_at?: string;
          default_fight_duration?: number;
          default_iterations?: number;
          id: string;
          mcp_servers?: Json;
          show_tooltips?: boolean;
          theme?: string;
          token_api?: string;
          token_claim?: string;
          updated_at?: string;
        };
        Update: {
          ai_key_secret_id?: string | null;
          ai_model?: string | null;
          ai_provider?: string | null;
          compact_mode?: boolean;
          created_at?: string;
          default_fight_duration?: number;
          default_iterations?: number;
          id?: string;
          mcp_servers?: Json;
          show_tooltips?: boolean;
          theme?: string;
          token_api?: string;
          token_claim?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      boost_balances: {
        Row: {
          balance: number | null;
          supabase_user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      admin_add_reserved_handle: {
        Args: { p_handle: string; p_reason: string };
        Returns: undefined;
      };
      admin_delete_paperdoll: {
        Args: { p_spec_id: number };
        Returns: undefined;
      };
      admin_delete_reserved_handle: {
        Args: { p_handle: string };
        Returns: undefined;
      };
      admin_list_reserved_handles: {
        Args: never;
        Returns: {
          created_at: string;
          handle: string;
          reason: string;
        }[];
        SetofOptions: {
          from: "*";
          to: "user_reserved_handles";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      admin_upsert_paperdoll: {
        Args: { p_character_name: string; p_simc: string; p_spec_id: number };
        Returns: undefined;
      };
      clear_ai_credentials: { Args: never; Returns: undefined };
      create_job: {
        Args: { p_sentinel_config: string; p_sim_config: string };
        Returns: Json;
      };
      custom_access_token_hook: { Args: { event: Json }; Returns: Json };
      delete_own_account: { Args: never; Returns: undefined };
      generate_default_handle: { Args: { user_id: string }; Returns: string };
      generate_random_seed: { Args: never; Returns: string };
      generate_token: { Args: { prefix: string }; Returns: string };
      get_friend_list_members: { Args: { p_list_id: string }; Returns: Json };
      get_friend_lists_for_user: { Args: { p_user_id: string }; Returns: Json };
      get_or_create_short_url: {
        Args: { p_target_url: string; p_user_id?: string };
        Returns: string;
      };
      is_admin: { Args: never; Returns: boolean };
      join_friend_list: { Args: { p_code: string }; Returns: Json };
      leave_friend_list: { Args: { p_list_id: string }; Returns: undefined };
      lookup_friend_invite: { Args: { p_code: string }; Returns: Json };
      mark_activity_seen: { Args: never; Returns: undefined };
      paddle_apply_customer_event: {
        Args: {
          p_customer_id: string;
          p_email: string;
          p_event_id: string;
          p_event_type: string;
          p_occurred_at: string;
        };
        Returns: string;
      };
      paddle_apply_subscription_event: {
        Args: {
          p_canceled_at: string | null;
          p_current_period_ends_at: string | null;
          p_current_period_starts_at: string | null;
          p_customer_id: string;
          p_event_id: string;
          p_event_type: string;
          p_next_billed_at: string | null;
          p_occurred_at: string;
          p_plan: string;
          p_quantity: number;
          p_scheduled_change_action: string | null;
          p_scheduled_change_effective_at: string | null;
          p_scheduled_change_resume_at: string | null;
          p_status: string;
          p_subscription_id: string;
          p_supabase_user_id: string | null;
        };
        Returns: string;
      };
      paddle_credit_boosts: {
        Args: {
          p_event_id: string;
          p_occurred_at: string;
          p_quantity: number;
          p_supabase_user_id: string;
          p_transaction_id: string;
        };
        Returns: string;
      };
      paddle_link_customer_to_user: {
        Args: { p_customer_id: string; p_supabase_user_id: string };
        Returns: string;
      };
      paddle_refund_boosts: {
        Args: {
          p_event_id: string;
          p_occurred_at: string;
          p_quantity: number;
          p_transaction_id: string;
        };
        Returns: string;
      };
      push_activity: {
        Args: { p_payload?: Json; p_type: string; p_user_id: string };
        Returns: undefined;
      };
      regenerate_token_api: { Args: never; Returns: string };
      regenerate_token_claim: { Args: never; Returns: string };
      remove_friend_list_member: {
        Args: { p_list_id: string; p_member_id: string };
        Returns: undefined;
      };
      season_rollover: {
        Args: {
          p_ends_at?: string;
          p_new_season_id: string;
          p_ruleset_version: number;
          p_starts_at: string;
        };
        Returns: {
          jobs_in_old_season: number;
          new_season_id: string;
          old_season_id: string;
        }[];
      };
      set_ai_credentials: {
        Args: { p_key: string; p_model: string; p_provider: string };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "admin";
      job_status: "pending" | "running" | "completed" | "failed" | "cancelled";
      sim_type: "quick" | "drops" | "bags";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export const Constants = {
  game: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin"],
      job_status: ["pending", "running", "completed", "failed", "cancelled"],
      sim_type: ["quick", "drops", "bags"],
    },
  },
} as const;
