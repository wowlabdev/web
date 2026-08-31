import type { DamageKind } from "wowlab-common";

import { describe, expect, it } from "vitest";

import { EM_DASH, formatDamage } from "./formatters";

type DamageCase = {
  expected: string;
  kind: DamageKind;
  name: string;
};

const damageCases: DamageCase[] = [
  {
    expected: EM_DASH,
    kind: { type: "None" },
    name: "formats no damage",
  },
  {
    expected: "42 flat",
    kind: { amount: 42, type: "Flat" },
    name: "formats flat damage",
  },
  {
    expected: "150.0% AP phys",
    kind: { coef: 1.5, is_physical: true, type: "ApCoefficient" },
    name: "formats physical attack-power damage",
  },
  {
    expected: "150.0% AP",
    kind: { coef: 1.5, is_physical: false, type: "ApCoefficient" },
    name: "omits the physical marker from magical attack-power damage",
  },
  {
    expected: "75.0% SP",
    kind: { coef: 0.75, is_physical: false, type: "SpCoefficient" },
    name: "formats spell-power damage",
  },
  {
    expected: "75.0% SP phys",
    kind: { coef: 0.75, is_physical: true, type: "SpCoefficient" },
    name: "marks physical spell-power damage",
  },
  {
    expected: "125.0% normalized weapon + 17 flat phys",
    kind: {
      flat_bonus: 17,
      is_physical: true,
      multiplier: 1.25,
      normalized: true,
      type: "Weapon",
    },
    name: "formats normalized weapon damage with a flat bonus",
  },
  {
    expected: "80.0% weapon",
    kind: {
      flat_bonus: 0,
      is_physical: false,
      multiplier: 0.8,
      normalized: false,
      type: "Weapon",
    },
    name: "omits inactive weapon qualifiers",
  },
];

describe("formatDamage", () => {
  it.each(damageCases)("$name", ({ expected, kind }) => {
    expect(formatDamage({ kind })).toBe(expected);
  });
});
