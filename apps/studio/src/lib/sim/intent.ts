import type { Item, Profile } from "wowlab-common";

import { buildSimConfig } from "@/lib/wasm/api";

import {
  createFixedDurationEncounter,
  CURRENT_EXPANSION_ID,
  type EncounterDefinition,
} from "./encounter";

type BuildProfileSimConfigArgs = {
  profile: Profile;
  rotationId: string;
  encounter?: EncounterDefinition;
  durationS?: number;
  enemyCount?: number;
  settings?: Record<string, unknown>;
  specId: number;
};

type CommonModule = typeof import("wowlab-common");

// docref:start sim-ui-build-profile-config
export function buildProfileSimConfig(
  common: CommonModule,
  {
    durationS,
    encounter,
    enemyCount,
    profile,
    rotationId,
    settings,
    specId,
  }: BuildProfileSimConfigArgs,
): string {
  return buildSimConfig(common, {
    encounter:
      encounter ??
      createFixedDurationEncounter({
        ...(durationS !== undefined && { durationS }),
        ...(enemyCount !== undefined && { enemyCount }),
      }),
    equipment: mapEquipment(profile.equipment),
    player_expansion_id: CURRENT_EXPANSION_ID,
    player_level: profile.character.level,
    rotation_id: rotationId,
    spec_id: specId,
    ...(profile.talents.encoded && { loadout: profile.talents.encoded }),
    // Omit `settings` entirely when absent: the wasm deserializer reads a
    // present-but-undefined map field via Reflect.get and throws, whereas a
    // missing key falls back to the Rust-side default.
    ...(settings && { settings }),
  });
}
// docref:end sim-ui-build-profile-config

export function mapEquipment(items: Item[]) {
  return items.map((item) => ({
    id: item.id,
    slot: item.slot,
    ...(item.bonus_ids && { bonus_ids: item.bonus_ids }),
    ...(item.crafted_stats && { crafted_stats: item.crafted_stats }),
    ...(item.crafting_quality != null && {
      crafting_quality: item.crafting_quality,
    }),
    ...(item.drop_level != null && { drop_level: item.drop_level }),
    ...(item.enchant_id != null && { enchant_id: item.enchant_id }),
    ...(item.gem_ids && { gem_ids: item.gem_ids }),
    ...(item.ilevel != null && { ilevel: item.ilevel }),
  }));
}
