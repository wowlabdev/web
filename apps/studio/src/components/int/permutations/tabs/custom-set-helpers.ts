import type { GearSlot, PermutationSpace, ResultItemDto } from "wowlab-common";

export type CandidateChoice = {
  itemId: number;
  source: string;
  bonusIds: number[];
  gemIds: number[];
  enchantId: number | undefined;
};

export type CustomSetRow = {
  slot: GearSlot;
  candidates: CandidateChoice[];
  current: number;
};

export function buildCustomSetRows(
  space: PermutationSpace,
  picks: Record<string, number>,
): CustomSetRow[] {
  return space.slots
    .filter((sc) => sc.candidates.length > 0)
    .map((sc) => ({
      candidates: sc.candidates.map((c) => ({
        bonusIds: c.item.bonus_ids ?? [],
        enchantId: c.item.enchant_id ?? undefined,
        gemIds: c.item.gem_ids ?? [],
        itemId: c.item.id,
        source: c.source,
      })),
      current: picks[sc.slot],
      slot: sc.slot,
    }));
}

export function buildResultItemsFromPicks(
  rows: CustomSetRow[],
): ResultItemDto[] {
  return rows.map((row) => {
    const picked =
      row.candidates.find((c) => c.itemId === row.current) ??
      row.candidates[0]!;

    return {
      bonusIds: picked.bonusIds,
      ci95Half: undefined,
      craftedStats: [],
      craftingQuality: undefined,
      dpsDeltaVsBaseline: 0,
      dropLevel: undefined,
      enchantId: picked.enchantId,
      gemBonusIds: [],
      gemIds: picked.gemIds,
      itemId: picked.itemId,
      itemLevel: undefined,
      meanDps: 0,
      rank: 1,
      slot: row.slot,
      sourceLabel: picked.source,
      suffix: undefined,
      winRate: undefined,
    };
  });
}

export function initialPicksFromSpace(
  space: PermutationSpace,
): Record<string, number> {
  const out: Record<string, number> = {};

  for (const sc of space.slots) {
    if (sc.candidates.length === 0) {
      continue;
    }

    const equipped = sc.candidates.find((c) => c.source === "equipped");

    out[sc.slot] = (equipped ?? sc.candidates[0])!.item.id;
  }

  return out;
}
