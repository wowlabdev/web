import type { Item } from "@wowlab/shared/lib/supabase/types";

export type ItemEffectJson = {
  category_cooldown: number;
  charges: number;
  cooldown: number;
  spell_id: number;
  trigger_type: number;
};

export type ItemEffectRow = {
  charges: string;
  cooldown: string;
  spellId: number;
  triggerType: number;
};

export type ItemStatJson = {
  type: number;
  value: number;
};

export type ItemStatRow = {
  statType: number;
  value: number;
};

export function getItemEffects(item: Item): ItemEffectRow[] {
  const effects = (item.effects as ItemEffectJson[] | null) ?? [];

  return effects.map((effect) => ({
    charges: effect.charges > 0 ? String(effect.charges) : "--",
    cooldown: effect.cooldown > 0 ? `${effect.cooldown / 1000}s` : "--",
    spellId: effect.spell_id,
    triggerType: effect.trigger_type,
  }));
}

export function getItemStats(item: Item): ItemStatRow[] {
  const stats = (item.stats as ItemStatJson[] | null) ?? [];

  return stats
    .filter((stat) => stat.value !== 0)
    .map((stat) => ({ statType: stat.type, value: stat.value }));
}
