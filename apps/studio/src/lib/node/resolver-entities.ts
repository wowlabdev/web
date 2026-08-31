import type { GameDataResolver } from "@wowlab/shared/lib/game-data/game-data-resolver.generated";
import type { GameRow } from "@wowlab/shared/lib/supabase/types";

import { getByIds } from "@/lib/game-data/pg-loader";
import { storedDocumentToRow } from "@/lib/game-data/store";

import type { ResolverDeps } from "./resolver-types";

type EntityResolver = Pick<
  GameDataResolver,
  | "getExpansionTraitTree"
  | "getItem"
  | "getPowerTypes"
  | "getRotationScript"
  | "getScalingData"
  | "getSpec"
  | "getSpell"
  | "getTraitTree"
>;

export function createEntityResolver({
  counters,
  onEvent,
  onProgress,
  store,
  supabase,
}: ResolverDeps): EntityResolver {
  return {
    async getExpansionTraitTree(expansionId, system) {
      const key = compositeKey([expansionId, system]);
      const tree = store.expansionTraitsCache.get(key);

      if (tree === undefined) {
        throw new Error(
          `Expansion trait tree ${system} for expansion ${expansionId} not found`,
        );
      }

      counters.cacheHits++;

      return tree;
    },

    async getItem(id) {
      const cached = store.itemCache.get(id);

      if (cached !== undefined) {
        counters.cacheHits++;
        onProgress?.(`Resolver: getItem(${id}) [memory hit]`);

        return cached;
      }

      const doc = await store.gameDb.collections.items_full
        .findOne(String(id))
        .exec();

      if (doc) {
        counters.cacheHits++;
        onProgress?.(`Resolver: getItem(${id}) [store hit]`);
        onEvent?.({ entity: "item", id, kind: "entity", source: "store" });
        const row = storedDocumentToRow(doc.toMutableJSON(), String(id));

        store.itemCache.set(id, row);

        return row;
      }

      counters.cacheMisses++;
      onProgress?.(`Resolver: getItem(${id}) [supabase]`);
      onEvent?.({ entity: "item", id, kind: "entity", source: "supabase" });
      const rows = await getByIds<GameRow<"items">>(supabase, "items", [id]);
      const row = rows.at(0);

      if (!row) {
        throw new Error(`Item ${id} not found`);
      }

      await store.gameDb.collections.items_full.upsert({
        ...row,
        pk: String(id),
      });
      store.itemCache.set(id, row);

      return row;
    },

    async getPowerTypes() {
      counters.cacheHits++;

      return store.powerTypes;
    },

    async getRotationScript(rotationId) {
      const cached = store.rotationCache.get(rotationId);

      if (cached !== undefined) {
        counters.cacheHits++;
        onProgress?.(`Resolver: getRotationScript(${rotationId}) [memory hit]`);

        return cached;
      }

      counters.cacheMisses++;
      onProgress?.(`Resolver: getRotationScript(${rotationId}) [supabase]`);
      const { data } = await supabase
        .from("rotations")
        .select("script")
        .eq("id", rotationId)
        .single()
        .throwOnError();

      const script = JSON.stringify(data.script);

      store.rotationCache.set(rotationId, script);

      return script;
    },

    async getScalingData() {
      counters.cacheHits++;

      return store.scalingResolver;
    },

    async getSpec(id) {
      const spec = store.specsCache.get(id);

      if (spec === undefined) {
        throw new Error(`Spec ${id} not found`);
      }

      counters.cacheHits++;

      return spec;
    },

    async getSpell(id) {
      const cached = store.spellCache.get(id);

      if (cached !== undefined) {
        counters.cacheHits++;
        onProgress?.(`Resolver: getSpell(${id}) [memory hit]`);

        return cached;
      }

      const doc = await store.gameDb.collections.spells_full
        .findOne(String(id))
        .exec();

      if (doc) {
        counters.cacheHits++;
        onProgress?.(`Resolver: getSpell(${id}) [store hit]`);
        onEvent?.({ entity: "spell", id, kind: "entity", source: "store" });
        const row = coerceSpellLabels(
          storedDocumentToRow(doc.toMutableJSON(), String(id)),
        );

        store.spellCache.set(id, row);

        return row;
      }

      counters.cacheMisses++;
      onProgress?.(`Resolver: getSpell(${id}) [supabase]`);
      onEvent?.({ entity: "spell", id, kind: "entity", source: "supabase" });
      const rows = await getByIds<GameRow<"spells">>(supabase, "spells", [id]);
      const fetched = rows.at(0);

      if (!fetched) {
        throw new Error(`Spell ${id} not found`);
      }

      const row = coerceSpellLabels(fetched);

      await store.gameDb.collections.spells_full.upsert({
        ...row,
        pk: String(id),
      });
      store.spellCache.set(id, row);

      return row;
    },

    async getTraitTree(id) {
      const tree = store.specsTraitsCache.get(id);

      if (tree === undefined) {
        throw new Error(`Trait tree for spec ${id} not found`);
      }

      counters.cacheHits++;

      return tree;
    },
  };
}

function coerceSpellLabels(row: GameRow<"spells">): GameRow<"spells"> {
  return { ...row, labels: row.labels ?? [] };
}

function compositeKey(parts: (number | string)[]): string {
  return parts.join(":");
}
