import type { Spell } from "@wowlab/shared/lib/supabase/types";

export type EffectRow = {
  apCoef: string;
  auraType: number;
  basePoints: number;
  chain: number;
  effectType: number;
  index: number;
  miscValue0: number;
  miscValue1: number;
  period: string;
  radius: string;
  spCoef: string;
  triggerSpell: number;
};

const MIN_LINKABLE_SPELL_ID = 1000;

export type FieldRow = {
  hint?: string;
  label: string;
  value: string;
};

export type PowerCostJson = {
  cost: number;
  cost_pct: number;
  optional_cost: number;
  power_type: number;
};

export type SpellEffectJson = {
  amplitude: number;
  aura: number;
  base_points: number;
  bonus_coefficient: number;
  bonus_coefficient_from_ap: number;
  chain_targets: number;
  coefficient: number;
  effect: number;
  index: number;
  misc_value_0: number;
  misc_value_1: number;
  period: number;
  radius_max: number;
  radius_min: number;
  trigger_spell: number;
  variance: number;
};

export function buildCoreFieldRows(
  spell: Spell,
  powerNames: Record<number, string>,
): FieldRow[] {
  const costs = getPowerCosts(spell);
  const rows: FieldRow[] = [
    { label: "Cast time", value: fmtMs(spell.cast_time) },
    { label: "GCD (start CD)", value: fmtMs(spell.start_recovery_time) },
    {
      hint: "recovery_time",
      label: "Cooldown",
      value: fmtMs(spell.recovery_time),
    },
  ];

  if (spell.max_charges > 0) {
    rows.push({
      hint: "charge_recovery_time",
      label: "Charges",
      value: `${spell.max_charges} × ${fmtMs(spell.charge_recovery_time)}`,
    });
  }

  rows.push({
    label: "Cost",
    value:
      costs.length > 0
        ? costs.map((cost) => fmtCostEntry(cost, powerNames)).join(", ")
        : "--",
  });

  if (spell.mana_cost > 0) {
    rows.push({ label: "Mana cost", value: String(spell.mana_cost) });
  }

  rows.push(
    { label: "Duration", value: fmtMs(spell.duration) },
    {
      label: "Max stacks",
      value: spell.max_stacks > 1 ? String(spell.max_stacks) : "--",
    },
  );

  if (spell.tick_period_ms > 0) {
    const periodicLabel = spell.periodic_type
      ? ` (${spell.periodic_type})`
      : "";

    rows.push({
      label: "Tick period",
      value: `${fmtMs(spell.tick_period_ms)}${periodicLabel}`,
    });
  }

  if (spell.rppm_base_rate > 0) {
    rows.push({ label: "RPPM", value: spell.rppm_base_rate.toFixed(2) });
  }

  if (spell.caster_aura_spell > 0) {
    rows.push({
      label: "Requires caster aura",
      value: `#${spell.caster_aura_spell}`,
    });
  }

  if (spell.target_aura_spell > 0) {
    rows.push({
      label: "Requires target aura",
      value: `#${spell.target_aura_spell}`,
    });
  }

  if (spell.exclude_caster_aura_spell > 0) {
    rows.push({
      label: "Blocked by caster aura",
      value: `#${spell.exclude_caster_aura_spell}`,
    });
  }

  return rows;
}

export function buildEffectRows(spell: Spell): EffectRow[] {
  return getEffects(spell).map((effect) => ({
    apCoef: fmtCoef(effect.bonus_coefficient_from_ap),
    auraType: effect.aura,
    basePoints: effect.base_points,
    chain: effect.chain_targets,
    effectType: effect.effect,
    index: effect.index,
    miscValue0: effect.misc_value_0,
    miscValue1: effect.misc_value_1,
    period: fmtMs(effect.period),
    radius: effect.radius_max === 0 ? "--" : `${effect.radius_max} yd`,
    spCoef: fmtCoef(effect.bonus_coefficient),
    triggerSpell: effect.trigger_spell,
  }));
}

export function getEffects(spell: Spell): SpellEffectJson[] {
  return (spell.effects as SpellEffectJson[] | null) ?? [];
}

export function getEffectSpellCandidates(spell: Spell): number[] {
  const ids = new Set<number>();

  for (const effect of getEffects(spell)) {
    if (effect.trigger_spell > 0) {
      ids.add(effect.trigger_spell);
    }

    for (const value of [
      effect.base_points,
      effect.misc_value_0,
      effect.misc_value_1,
    ]) {
      const id = Math.round(value);

      if (id >= MIN_LINKABLE_SPELL_ID) {
        ids.add(id);
      }
    }
  }

  return [...ids];
}

export function getPowerCosts(spell: Spell): PowerCostJson[] {
  return (spell.power_costs as PowerCostJson[] | null) ?? [];
}

export function getTriggerSpellIds(spell: Spell): number[] {
  const ids = new Set<number>();

  for (const effect of getEffects(spell)) {
    if (effect.trigger_spell > 0) {
      ids.add(effect.trigger_spell);
    }
  }

  for (const id of spell.effect_trigger_spell) {
    if (id > 0) {
      ids.add(id);
    }
  }

  return [...ids];
}

export function trimNum(n: number, digits = 4): string {
  return String(Number(n.toFixed(digits)));
}

function fmtCoef(value: number): string {
  return value === 0 ? "--" : trimNum(value);
}

function fmtCostEntry(
  cost: PowerCostJson,
  powerNames: Record<number, string>,
): string {
  const parts: string[] = [];

  if (cost.cost !== 0) {
    parts.push(`${cost.cost}`);
  }

  if (cost.cost_pct !== 0) {
    parts.push(`${cost.cost_pct}%`);
  }

  const amount = parts.length > 0 ? parts.join(" + ") : "0";
  const name = powerNames[cost.power_type] ?? `#${cost.power_type}`;

  return `${amount} ${name}`;
}

function fmtMs(ms: number): string {
  return ms === 0 ? "--" : `${ms} ms`;
}
