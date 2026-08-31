// Constants

export {
  BAGS_STEP_LABELS,
  BIB_BLOCK_THRESHOLD,
  BIB_WARN_THRESHOLD,
} from "./bags-config";
export { DROPS_STEP_LABELS } from "./drops-config";
export {
  ELIMINATION_THRESHOLD,
  LOCK_THRESHOLD,
  PERMS_PER_CHUNK,
  STEP_LABELS_MAP,
  TOP_N_FRACTION,
  TOTAL_CHUNKS,
} from "./mock-bags-config";
export {
  PAPERDOLL_LEFT_SLOTS,
  PAPERDOLL_RIGHT_SLOTS,
  PAPERDOLL_TRINKET_SLOTS,
  PAPERDOLL_WEAPON_SLOTS,
  SLOT_LABELS,
  SLOT_ORDER,
} from "./slots";

// Sources

export {
  DEFAULT_DIFFICULTY,
  DEFAULT_SOURCE_CATALOG,
  DIFFICULTIES,
  type Difficulty,
  getInstancesByCategory,
  SOURCE_CATEGORIES,
  type SourceCatalog,
  type SourceCategory,
  type SourceCategoryMeta,
  type SourceId,
  type SourceInstance,
} from "./sources";

// Utilities

export {
  createFixedDurationEncounter,
  CURRENT_EXPANSION_ID,
  CURRENT_TARGET_LEVEL,
  DEFAULT_ENCOUNTER_DURATION_S,
  type EncounterDefinition,
  type SimConfigInput,
  type SimEquipmentInput,
} from "./encounter";
export { buildProfileSimConfig, mapEquipment } from "./intent";
export { buildInitialSlots } from "./mock-slots";
export {
  computeDpsDeltaPct,
  computeLikelihoodAlpha,
} from "./slot-calculations";
