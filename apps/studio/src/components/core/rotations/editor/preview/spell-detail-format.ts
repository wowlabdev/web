import type { CooldownInfo, SpellInfo } from "wowlab-common";

export function formatCooldownCharges(
  cooldown: CooldownInfo | undefined,
): string {
  if (!cooldown) {
    return "--";
  }

  const charges = cooldown.max_charges > 1 ? ` × ${cooldown.max_charges}` : "";

  return `${cooldown.duration_secs}s${charges}`;
}

export function formatDamageCoefficient(damage: SpellInfo["damage"]): string {
  const kind = damage.kind;

  switch (kind.type) {
    case "ApCoefficient": {
      return `AP × ${kind.coef}${kind.is_physical ? "" : " (magical)"}`;
    }

    case "Flat": {
      return `flat ${kind.amount}`;
    }

    case "None": {
      return "--";
    }

    case "SpCoefficient": {
      return `SP × ${kind.coef}${kind.is_physical ? " (physical)" : ""}`;
    }

    default: {
      return JSON.stringify(kind);
    }
  }
}

export function formatGain(primary: number, secondary: number): string {
  const parts: string[] = [];

  if (primary !== 0) {
    parts.push(`+${primary}`);
  }

  if (secondary !== 0) {
    parts.push(`+${secondary} (2°)`);
  }

  return parts.join(" ");
}

export function formatResourceCost(primary: number, secondary: number): string {
  const parts: string[] = [];

  if (primary !== 0) {
    parts.push(String(primary));
  }

  if (secondary !== 0) {
    parts.push(`+${secondary} (2°)`);
  }

  return parts.join(" ");
}
