import type { AuraInfo } from "wowlab-common";

export type AuraCategory =
  "buff" | "debuff" | "passive" | "pet" | "proc" | "system";

/** Fixed render order for category groups. */
export const AURA_CATEGORY_ORDER: readonly AuraCategory[] = [
  "buff",
  "debuff",
  "proc",
  "pet",
  "passive",
  "system",
] as const;

/** Base hue/saturation per category. Lightness varies per lane for contrast. */
const CATEGORY_HSL: Record<AuraCategory, { hue: number; sat: number }> = {
  buff: { hue: 145, sat: 55 },
  debuff: { hue: 8, sat: 62 },
  passive: { hue: 240, sat: 10 },
  pet: { hue: 265, sat: 52 },
  proc: { hue: 200, sat: 60 },
  system: { hue: 240, sat: 6 },
};

/** A window is treated as permanent when it covers (almost) the whole fight. */
const PERMANENT_COVERAGE = 0.97;

/** Representative swatch colour for a whole category. */
export function auraCategoryColor(category: AuraCategory): string {
  return auraLaneColor(category, 0);
}

/** Semantic colour for a lane, varied by its index within the category. */
export function auraLaneColor(category: AuraCategory, index: number): string {
  const { hue, sat } = CATEGORY_HSL[category];
  const lightness = 62 - (index % 4) * 7;

  return `hsl(${hue} ${sat}% ${lightness}%)`;
}

/**
 * Classify an aura into a semantic category using its introspection metadata
 * and how much of the fight its windows cover. `info` is null for auras the
 * spec never declares (raw numeric slugs) — those are system noise.
 */
export function classifyAura(
  info: AuraInfo | null,
  coverage: number,
): AuraCategory {
  if (!info) {
    return "system";
  }

  if (info.base_duration_ms === 0 || coverage >= PERMANENT_COVERAGE) {
    return "passive";
  }

  if (info.on === "target") {
    return "debuff";
  }

  if (info.on === "pet") {
    return "pet";
  }

  if (info.max_stacks > 1) {
    return "proc";
  }

  return "buff";
}
