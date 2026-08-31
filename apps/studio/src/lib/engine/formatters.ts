import type { DamageKind, PeriodicInfo, SpellInfo } from "wowlab-common";

export const EM_DASH = "\u2014";

export function formatCooldown(cd: SpellInfo["cooldown"]): string {
  if (!cd) {
    return EM_DASH;
  }

  const parts: string[] = [`${cd.duration_secs}s`];

  if (cd.max_charges > 1) {
    parts.push(`${cd.max_charges} charges`);

    if (cd.recharge_secs !== cd.duration_secs) {
      parts[0] = `${cd.recharge_secs}s recharge`;
    }
  }

  return parts.join(", ");
}

export function formatCost(
  cost: number,
  gain: number,
  resourceName: string,
): string {
  if (cost > 0) {
    return `${cost} ${resourceName}`;
  }

  if (gain > 0) {
    return `+${gain} ${resourceName}`;
  }

  return EM_DASH;
}

export function formatDamage(damage: { kind: DamageKind }): string {
  const kind = damage.kind;

  switch (kind.type) {
    case "ApCoefficient": {
      const phys = kind.is_physical ? " phys" : "";

      return `${(kind.coef * 100).toFixed(1)}% AP${phys}`;
    }

    case "Flat": {
      return `${kind.amount} flat`;
    }

    case "None": {
      return EM_DASH;
    }

    case "SpCoefficient": {
      const phys = kind.is_physical ? " phys" : "";

      return `${(kind.coef * 100).toFixed(1)}% SP${phys}`;
    }

    case "Weapon": {
      const flatBonus =
        kind.flat_bonus === 0 ? "" : ` + ${kind.flat_bonus} flat`;
      const normalized = kind.normalized ? " normalized" : "";
      const phys = kind.is_physical ? " phys" : "";

      return `${(kind.multiplier * 100).toFixed(1)}%${normalized} weapon${flatBonus}${phys}`;
    }

    default: {
      return assertNeverDamageKind(kind);
    }
  }
}

export function formatPeriodic(periodic: PeriodicInfo | undefined): string {
  if (!periodic) {
    return EM_DASH;
  }

  const tickSec = (periodic.tick_ms / 1000).toFixed(1);
  const { effect } = periodic;

  if (effect.type === "Damage") {
    const phys = effect.is_physical ? " phys" : "";

    return `${(effect.ap_coef * 100).toFixed(1)}% AP${phys} / ${tickSec}s`;
  }

  if (effect.type === "SpDamage") {
    const phys = effect.is_physical ? " phys" : "";

    return `${(effect.sp_coef * 100).toFixed(1)}% SP${phys} / ${tickSec}s`;
  }

  if (effect.type === "ApplyAura") {
    return `aura ${effect.target_aura_local} / ${tickSec}s`;
  }

  if (effect.type === "RemoveStack") {
    return `remove stack / ${tickSec}s`;
  }

  if (effect.type === "MaxHealthDamage") {
    const phys = effect.is_physical ? " phys" : "";

    return `${effect.percent}% HP${phys} / ${tickSec}s`;
  }

  if (effect.type !== "ResourceGain" && effect.type !== "ResourceDrain") {
    return EM_DASH;
  }

  const sign = effect.type === "ResourceDrain" ? "-" : "+";

  return `${sign}${effect.amount} / ${tickSec}s`;
}

export function formatSpellTimingMs(ms: number): string {
  if (ms === 0) {
    return "Instant";
  }

  return `${(ms / 1000).toFixed(1)}s`;
}

function assertNeverDamageKind(kind: never): never {
  throw new Error(`Unhandled damage kind: ${JSON.stringify(kind)}`);
}
