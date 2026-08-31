import type { Spell } from "@wowlab/shared/lib/supabase/types";

import { getEffects, getPowerCosts, trimNum } from "./spell-fields";

export function buildAuraToml(spell: Spell): string {
  const key = tomlKey(spell.name);
  const lines = [`[auras.${key}]`, `id = ${spell.id}`, `on = "player"`];

  if (spell.duration > 0) {
    lines.push(`duration_ms = ${spell.duration}`);
  }

  if (spell.max_stacks > 1) {
    lines.push(`max_stacks = ${spell.max_stacks}`);
  }

  if (spell.tick_period_ms > 0) {
    const apCoef = getEffects(spell).reduce(
      (max, e) => Math.max(max, e.bonus_coefficient_from_ap),
      0,
    );

    lines.push(
      `periodic_damage = { tick_ms = ${spell.tick_period_ms}, ap_coef = ${trimNum(apCoef)} }`,
    );
  }

  return lines.join("\n");
}

export function buildSpellToml(spell: Spell): string {
  const key = tomlKey(spell.name);
  const lines = [`[spells.${key}]`, `id = ${spell.id}`];

  const damage = bestDamageEffect(spell);

  if (damage) {
    lines.push(
      `damage = { spell_id = ${spell.id}, effect = ${damage.index}, kind = "${damage.kind}" }  # ${damage.kind.toUpperCase()} × ${trimNum(damage.coef)}`,
    );
  }

  const cost = getPowerCosts(spell).find((c) => c.cost > 0);

  if (cost) {
    lines.push(`cost = ${cost.cost.toFixed(1)}`);
  }

  if (spell.cast_time > 0) {
    lines.push(`cast_time_ms = ${spell.cast_time}`);
  }

  if (spell.recovery_time > 0) {
    lines.push(`cooldown = ${(spell.recovery_time / 1000).toFixed(1)}`);
  }

  if (spell.max_charges > 0) {
    lines.push(
      `charges = ${spell.max_charges}`,
      `charge_cd = ${(spell.charge_recovery_time / 1000).toFixed(1)}`,
    );
  }

  return lines.join("\n");
}

export function tomlKey(name: string): string {
  const upper = name.toUpperCase().replaceAll(/[^A-Z0-9]+/g, "_");

  let start = 0;
  let end = upper.length;

  while (start < end && upper[start] === "_") {
    start += 1;
  }

  while (end > start && upper[end - 1] === "_") {
    end -= 1;
  }

  return upper.slice(start, end) || "ABILITY";
}

function bestDamageEffect(spell: Spell): {
  coef: number;
  index: number;
  kind: "ap" | "sp";
} | null {
  let best: { coef: number; index: number; kind: "ap" | "sp" } | null = null;

  for (const effect of getEffects(spell)) {
    if (effect.bonus_coefficient_from_ap > (best?.coef ?? 0)) {
      best = {
        coef: effect.bonus_coefficient_from_ap,
        index: effect.index,
        kind: "ap",
      };
    }

    if (effect.bonus_coefficient > (best?.coef ?? 0)) {
      best = {
        coef: effect.bonus_coefficient,
        index: effect.index,
        kind: "sp",
      };
    }
  }

  return best;
}
