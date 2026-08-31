import type { GameDataResolver } from "@wowlab/shared/lib/game-data/game-data-resolver.generated";

import { storedDocumentToRow } from "@/lib/game-data/store";

import type { ResolverDeps } from "./resolver-types";

type DatabaseResolver = Pick<
  GameDataResolver,
  | "getChallengeModeHealth"
  | "getContentTuning"
  | "getContentTuningXDifficulty"
  | "getContentTuningXExpected"
  | "getCreature"
  | "getCreatureDifficulties"
  | "getEnchantment"
  | "getExpectedStatMod"
  | "getExpectedStats"
  | "getItemDamageScaling"
>;

export function createDatabaseResolver({
  counters,
  onProgress,
  store,
  supabase,
}: ResolverDeps): DatabaseResolver {
  return {
    async getChallengeModeHealth(keystoneLevel) {
      counters.cacheMisses++;
      onProgress?.(
        `Resolver: getChallengeModeHealth(${keystoneLevel}) [supabase]`,
      );
      const { data } = await supabase
        .schema("game")
        .from("challenge_mode_health")
        .select("*")
        .eq("challenge_level", keystoneLevel)
        .limit(1)
        .maybeSingle()
        .throwOnError();

      if (!data) {
        throw new Error(`Challenge mode health ${keystoneLevel} not found`);
      }

      return data;
    },

    async getContentTuning(contentTuningId) {
      counters.cacheMisses++;
      onProgress?.(`Resolver: getContentTuning(${contentTuningId}) [supabase]`);
      const { data } = await supabase
        .schema("game")
        .from("content_tunings")
        .select("*")
        .eq("id", contentTuningId)
        .limit(1)
        .maybeSingle()
        .throwOnError();

      if (!data) {
        throw new Error(`Content tuning ${contentTuningId} not found`);
      }

      const {
        primary_stat_scaling_mod_player_data_element_character_multipli,
        ...contentTuning
      } = data;

      return {
        ...contentTuning,
        primary_stat_scaling_mod_player_data_element_character_multiplier:
          primary_stat_scaling_mod_player_data_element_character_multipli,
      };
    },

    async getContentTuningXDifficulty(contentTuningId) {
      counters.cacheMisses++;
      onProgress?.(
        `Resolver: getContentTuningXDifficulty(${contentTuningId}) [supabase]`,
      );
      const { data } = await supabase
        .schema("game")
        .from("content_tuning_x_difficulty")
        .select("*")
        .eq("content_tuning_id", contentTuningId)
        .throwOnError();

      return data;
    },

    async getContentTuningXExpected(contentTuningId) {
      counters.cacheMisses++;
      onProgress?.(
        `Resolver: getContentTuningXExpected(${contentTuningId}) [supabase]`,
      );
      const { data } = await supabase
        .schema("game")
        .from("content_tuning_x_expected")
        .select("*")
        .eq("content_tuning_id", contentTuningId)
        .throwOnError();

      return data;
    },

    async getCreature(creatureId) {
      counters.cacheMisses++;
      onProgress?.(`Resolver: getCreature(${creatureId}) [supabase]`);
      const { data } = await supabase
        .schema("game")
        .from("creatures")
        .select("*")
        .eq("id", creatureId)
        .limit(1)
        .maybeSingle()
        .throwOnError();

      if (!data) {
        throw new Error(`Creature ${creatureId} not found`);
      }

      return data;
    },

    async getCreatureDifficulties(creatureId) {
      counters.cacheMisses++;
      onProgress?.(
        `Resolver: getCreatureDifficulties(${creatureId}) [supabase]`,
      );
      const { data } = await supabase
        .schema("game")
        .from("creature_difficulties")
        .select("*")
        .eq("creature_id", creatureId)
        .throwOnError();

      return data;
    },

    async getEnchantment(id) {
      const pk = String(id);
      const cached = await store.gameDb.collections.enchantments
        .findOne(pk)
        .exec();

      if (cached) {
        counters.cacheHits++;

        return storedDocumentToRow(cached.toMutableJSON(), pk);
      }

      counters.cacheMisses++;
      onProgress?.(`Resolver: getEnchantment(${id}) [supabase]`);
      const { data } = await supabase
        .schema("game")
        .from("enchantments")
        .select("*")
        .eq("id", id)
        .limit(1)
        .maybeSingle()
        .throwOnError();

      if (!data) {
        throw new Error(`Enchantment ${id} not found`);
      }

      await store.gameDb.collections.enchantments.upsert({ ...data, pk });

      return data;
    },

    async getExpectedStatMod(expectedStatModId) {
      counters.cacheMisses++;
      onProgress?.(
        `Resolver: getExpectedStatMod(${expectedStatModId}) [supabase]`,
      );
      const { data } = await supabase
        .schema("game")
        .from("expected_stat_mods")
        .select("*")
        .eq("id", expectedStatModId)
        .limit(1)
        .maybeSingle()
        .throwOnError();

      if (!data) {
        throw new Error(
          `Expected stat modifier ${expectedStatModId} not found`,
        );
      }

      return data;
    },

    async getExpectedStats(expansionId, lvl) {
      const pk = `${expansionId}:${lvl}`;
      const cached = await store.gameDb.collections.expected_stats
        .findOne(pk)
        .exec();

      if (cached) {
        counters.cacheHits++;

        return storedDocumentToRow(cached.toMutableJSON(), pk);
      }

      counters.cacheMisses++;
      onProgress?.(
        `Resolver: getExpectedStats(${expansionId}, ${lvl}) [supabase]`,
      );
      const { data } = await supabase
        .schema("game")
        .from("expected_stats")
        .select("*")
        .eq("expansion_id", expansionId)
        .eq("lvl", lvl)
        .limit(1)
        .maybeSingle()
        .throwOnError();

      if (!data) {
        throw new Error(
          `expected_stats not found for expansion ${expansionId}, lvl ${lvl}`,
        );
      }

      await store.gameDb.collections.expected_stats.upsert({ ...data, pk });

      return data;
    },

    async getItemDamageScaling(itemLevel, weaponType) {
      const pk = `${weaponType}:${itemLevel}`;
      const cached = await store.gameDb.collections.item_damage_scaling
        .findOne(pk)
        .exec();

      if (cached) {
        counters.cacheHits++;

        return storedDocumentToRow(cached.toMutableJSON(), pk);
      }

      counters.cacheMisses++;
      onProgress?.(
        `Resolver: getItemDamageScaling(${itemLevel}, ${weaponType}) [supabase]`,
      );
      const { data } = await supabase
        .schema("game")
        .from("item_damage_scaling")
        .select("*")
        .eq("item_level", itemLevel)
        .eq("weapon_type", weaponType)
        .limit(1)
        .maybeSingle()
        .throwOnError();

      if (!data) {
        throw new Error(
          `item_damage_scaling not found for weapon_type=${weaponType}, item_level=${itemLevel}`,
        );
      }

      await store.gameDb.collections.item_damage_scaling.upsert({
        ...data,
        pk,
      });

      return data;
    },
  };
}
