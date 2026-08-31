import type { SpellInfo } from "wowlab-common";

import type { Spell } from "@wowlab/shared/lib/supabase/types";

import { formatDamageCoefficient } from "@/components/core/rotations/editor/preview/spell-detail-format";

import { getEffects, getPowerCosts, trimNum } from "./spell-fields";

export type DiffRow = {
  game: string;
  label: string;
  manifest: string;
  status: DiffStatus;
};

export type DiffStatus = "info" | "mismatch" | "ok";

const COEF_TOLERANCE = 0.01;

export function buildSpellDiff(spell: Spell, info: SpellInfo): DiffRow[] {
  const rows: DiffRow[] = [
    {
      game: `${spell.cast_time} ms`,
      label: "Cast time",
      manifest: `${info.cast_time_ms} ms`,
      status: compareStatus(spell.cast_time === info.cast_time_ms),
    },
  ];

  const gameCdSecs = spell.recovery_time / 1000;
  const manifestCdSecs = info.cooldown?.duration_secs ?? 0;

  rows.push({
    game: `${gameCdSecs}s`,
    label: "Cooldown",
    manifest: `${manifestCdSecs}s`,
    status: compareStatus(nearlyEqual(gameCdSecs, manifestCdSecs, 0.001)),
  });

  if (spell.max_charges > 0 || (info.cooldown?.max_charges ?? 0) > 1) {
    const gameCharges = spell.max_charges;
    const manifestCharges = info.cooldown?.max_charges ?? 0;

    rows.push({
      game: String(gameCharges),
      label: "Charges",
      manifest: String(manifestCharges),
      status: compareStatus(gameCharges === manifestCharges),
    });
  }

  const gameCost = gamePrimaryCost(spell);

  rows.push({
    game: String(gameCost),
    label: "Resource cost",
    manifest: String(info.resource_cost),
    status: compareStatus(nearlyEqual(gameCost, info.resource_cost, 0.001)),
  });

  const damageManifest = formatDamageCoefficient(info.damage);
  const kind = info.damage.kind;

  if (kind.type === "ApCoefficient") {
    const gc = gameApCoef(spell);

    rows.push({
      game: `AP × ${trimNum(gc)}`,
      label: "Damage coef",
      manifest: damageManifest,
      status: compareStatus(nearlyEqual(gc, kind.coef)),
    });
  } else if (kind.type === "SpCoefficient") {
    const gc = gameSpCoef(spell);

    rows.push({
      game: `SP × ${trimNum(gc)}`,
      label: "Damage coef",
      manifest: damageManifest,
      status: compareStatus(nearlyEqual(gc, kind.coef)),
    });
  } else {
    rows.push({
      game: "--",
      label: "Damage coef",
      manifest: damageManifest,
      status: "info",
    });
  }

  rows.push({
    game: "--",
    label: "Applies aura",
    manifest: info.applies_aura_id == null ? "--" : `#${info.applies_aura_id}`,
    status: "info",
  });

  return rows;
}

function compareStatus(equal: boolean): DiffStatus {
  return equal ? "ok" : "mismatch";
}

function gameApCoef(spell: Spell): number {
  return getEffects(spell).reduce(
    (max, effect) => Math.max(max, effect.bonus_coefficient_from_ap),
    0,
  );
}

function gamePrimaryCost(spell: Spell): number {
  return getPowerCosts(spell).find((cost) => cost.cost > 0)?.cost ?? 0;
}

function gameSpCoef(spell: Spell): number {
  return getEffects(spell).reduce(
    (max, effect) => Math.max(max, effect.bonus_coefficient),
    0,
  );
}

function nearlyEqual(a: number, b: number, tol = COEF_TOLERANCE): boolean {
  return Math.abs(a - b) <= tol;
}
