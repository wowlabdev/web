import type { GearSlot } from "wowlab-common";

export const CURRENT_EXPANSION_ID = 11;
export const CURRENT_TARGET_LEVEL = 80;
export const DEFAULT_ENCOUNTER_DURATION_S = 300;

export type DifficultyContext =
  | { expansion_id: number; kind: "generic" }
  | { difficulty_id: number; expansion_id: number; kind: "dungeon" }
  | { difficulty_id: number; expansion_id: number; kind: "raid" }
  | {
      difficulty_id: number;
      expansion_id: number;
      keystone_level: number;
      kind: "mythic_plus";
      season_id: number;
    };

export type EncounterDefinition = {
  blocked_los_pairs: { a: PositionedActorRef; b: PositionedActorRef }[];
  enemies: EnemyDefinition[];
  fixed_duration_s?: number;
  groups: EnemyGroupDefinition[];
  initial_player_transform: SpatialTransform;
  pulls: PullDefinition[];
  spatial_scene: {
    layers: { id: number; slug: string }[];
    obstacles: StaticObstacle[];
  };
  termination:
    | "all_enemies_in_required_groups_dead"
    | "fixed_duration"
    | "primary_required_enemy_dead"
    | "required_groups_complete";
  version: 2;
  waves: WaveDefinition[];
};

export type EncounterScriptEvent =
  | {
      actor: PositionedActorRef;
      at_s: number;
      kind: "move";
      transform: SpatialTransform;
    }
  | {
      at_s: number;
      counts_as_completion: boolean;
      enemy: number;
      kind: "despawn";
    };

export type EnemyDefinition = {
  armor_override?: number;
  auto_attack_dps_override?: number;
  difficulty: DifficultyContext;
  group_id: number;
  health: EnemyHealthInput;
  id: number;
  identity: EnemyIdentityInput;
  initial_transform: SpatialTransform;
  level: number;
  role: "add" | "boss" | "normal";
  slug: string;
  spawn_at_s: number;
  spell_damage_override?: number;
  tags: string[];
};

export type EnemyGroupDefinition = {
  enemy_ids: number[];
  id: number;
  required: boolean;
  slug: string;
  tags: string[];
  wave_id: number;
};

export type EnemyHealthInput =
  | { kind: "auto" }
  | { kind: "fixed"; max_health: number }
  | {
      death_at_s: number;
      display_max_health: number;
      kind: "scripted_linear";
    };

export type EnemyIdentityInput =
  { display_name: string; kind: "anonymous" } | { kind: "npc"; npc_id: number };

export type PlayerResetFlag =
  "auras" | "cooldowns" | "guardians" | "position" | "resources";

export type Position2 = { x: number; y: number };

export type PositionedActorRef =
  { kind: "enemy"; enemy: number } | { kind: "player" };

export type PullDefinition = {
  events: EncounterScriptEvent[];
  id: number;
  player_start_transform?: SpatialTransform;
  preferred_target: number;
  reset_after_completion: PlayerResetFlag[];
  wave_ids: number[];
};

export type SimConfigInput = {
  encounter: EncounterDefinition;
  equipment: SimEquipmentInput[];
  loadout?: string;
  player_expansion_id: number;
  player_level: number;
  rotation_id: string;
  settings?: Record<string, unknown>;
  spec_id: number;
};

export type SimEquipmentInput = {
  bonus_ids?: number[];
  crafted_stats?: number[];
  crafting_quality?: number;
  drop_level?: number;
  enchant_id?: number;
  gem_ids?: number[];
  id: number;
  ilevel?: number;
  slot: GearSlot;
};

export type SpatialTransform = {
  heading: number;
  layer: number;
  position: Position2;
};

export type StaticObstacle =
  | {
      end: Position2;
      kind: "segment";
      layer: number;
      start: Position2;
    }
  | {
      exterior: Position2[];
      holes: Position2[][];
      kind: "polygon";
      layer: number;
    };

export type WaveDefinition = {
  depends_on_groups: number[];
  group_ids: number[];
  id: number;
  minimum_activation_s: number;
  pull_id: number;
};

type FixedDurationEncounterOptions = {
  durationS?: number;
  enemyCount?: number;
  expansionId?: number;
  targetLevel?: number;
};

export function createFixedDurationEncounter({
  durationS = DEFAULT_ENCOUNTER_DURATION_S,
  enemyCount = 1,
  expansionId = CURRENT_EXPANSION_ID,
  targetLevel = CURRENT_TARGET_LEVEL,
}: FixedDurationEncounterOptions = {}): EncounterDefinition {
  if (!Number.isFinite(durationS) || durationS <= 0) {
    throw new Error("Encounter duration must be a finite positive number.");
  }

  if (
    !Number.isSafeInteger(enemyCount) ||
    enemyCount < 1 ||
    enemyCount > 65_535
  ) {
    throw new Error(
      "Encounter enemy count must be an integer from 1 through 65535.",
    );
  }

  const enemyIds = Array.from({ length: enemyCount }, (_, id) => id);
  const enemies = enemyIds.map((id): EnemyDefinition => {
    const angle = (id * Math.PI * 2) / enemyCount;

    return {
      difficulty: { expansion_id: expansionId, kind: "generic" },
      group_id: 0,
      health: {
        death_at_s: durationS,
        display_max_health: 1_000_000,
        kind: "scripted_linear",
      },
      id,
      identity: {
        display_name: id === 0 ? "Training Dummy" : `Training Dummy ${id + 1}`,
        kind: "anonymous",
      },
      initial_transform: {
        heading: angle + Math.PI,
        layer: 0,
        position: { x: Math.cos(angle) * 3, y: Math.sin(angle) * 3 },
      },
      level: targetLevel,
      role: id === 0 ? "boss" : "normal",
      slug: id === 0 ? "training_dummy" : `training_dummy_${id + 1}`,
      spawn_at_s: 0,
      tags: [],
    };
  });

  return {
    blocked_los_pairs: [],
    enemies,
    fixed_duration_s: durationS,
    groups: [
      {
        enemy_ids: enemyIds,
        id: 0,
        required: true,
        slug: "fixed_duration",
        tags: [],
        wave_id: 0,
      },
    ],
    initial_player_transform: {
      heading: 0,
      layer: 0,
      position: { x: 0, y: 0 },
    },
    pulls: [
      {
        events: [],
        id: 0,
        preferred_target: 0,
        reset_after_completion: [],
        wave_ids: [0],
      },
    ],
    spatial_scene: {
      layers: [{ id: 0, slug: "ground" }],
      obstacles: [],
    },
    termination: "fixed_duration",
    version: 2,
    waves: [
      {
        depends_on_groups: [],
        group_ids: [0],
        id: 0,
        minimum_activation_s: 0,
        pull_id: 0,
      },
    ],
  };
}
