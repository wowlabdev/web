import type {
  ResultExportDto,
  ResultItemDto,
  SlotItemEntryView,
  TournamentView,
} from "wowlab-common";

export type BuildBibExportArgs = {
  tournament: TournamentView;
  spec: string;
  jobId?: string;
  generatedAtMs?: number;
  note?: string;
  identityLookup?: SlotIdentityLookup;
  slotSlugLookup?: SlotSlugLookup;
};

export type BuildCustomSetExportArgs = {
  picks: ResultItemDto[];
  spec: string;
  generatedAtMs?: number;
  note?: string;
  kind?: "bib" | "drops";
};

// TournamentView stores items as (item_id, bonus_id_hash); the addon needs full identity to rebuild the item link.
export type ResultItemIdentity = {
  bonusIds?: number[];
  gemIds?: number[];
  gemBonusIds?: number[];
  enchantId?: number;
  craftedStats?: number[];
  craftingQuality?: number;
  dropLevel?: number;
  suffix?: number;
  itemLevel?: number;
};

export type SlotIdentityLookup = (
  slotIndex: number,
  itemId: number,
  bonusIdHash: number,
) => ResultItemIdentity | null | undefined;

// slotIndex is a permutation-space contested-slot position, not a WoW inventory_type; falls back to slot_<N>.
export type SlotSlugLookup = (slotIndex: number) => string | null | undefined;

type DiffArgs = {
  slotIndex: number;
  itemId: number;
  bonusIdHash: number;
  meanDps: number;
  ci95Half: number;
  rank: number;
  baselineDps: number;
  identityLookup?: SlotIdentityLookup;
  slotSlugLookup?: SlotSlugLookup;
};

type EntryArgs = {
  slotIndex: number;
  entry: SlotItemEntryView;
  baselineDps: number;
  identityLookup?: SlotIdentityLookup;
  slotSlugLookup?: SlotSlugLookup;
};

// Empty when the winning permutation has no diffs (winner == baseline); caller must handle.
export function buildBibExport(args: BuildBibExportArgs): ResultExportDto {
  const winner = args.tournament.top_permutations.at(0);
  const items: ResultItemDto[] = winner
    ? winner.diffs.map((diff, index) =>
        diffToResultItem({
          baselineDps: args.tournament.stats.baseline_dps,
          bonusIdHash: diff.bonus_id_hash,
          ci95Half: winner.ci95_half,
          identityLookup: args.identityLookup,
          itemId: diff.item_id,
          meanDps: winner.mean_dps,
          rank: index + 1,
          slotIndex: diff.slot_index,
          slotSlugLookup: args.slotSlugLookup,
        }),
      )
    : [];

  return {
    baselineDps: args.tournament.stats.baseline_dps,
    generatedAtMs: args.generatedAtMs ?? Date.now(),
    items,
    jobId: args.jobId,
    kind: "bib",
    note: args.note,
    spec: args.spec,
    v: 1,
    winnerDps: args.tournament.stats.winner_dps,
  };
}

export function buildCustomSetExport(
  args: BuildCustomSetExportArgs,
): ResultExportDto {
  return {
    baselineDps: 0,
    generatedAtMs: args.generatedAtMs ?? Date.now(),
    items: args.picks,
    jobId: undefined,
    kind: args.kind ?? "bib",
    note: args.note ?? "Manually built debug set",
    spec: args.spec,
    v: 1,
    winnerDps: 0,
  };
}

export function buildDropsExport(args: BuildBibExportArgs): ResultExportDto {
  const items: ResultItemDto[] = [];

  for (const slot of args.tournament.slot_rankings) {
    for (const entry of slot.items) {
      items.push(
        entryToResultItem({
          baselineDps: args.tournament.stats.baseline_dps,
          entry,
          identityLookup: args.identityLookup,
          slotIndex: slot.slot_index,
          slotSlugLookup: args.slotSlugLookup,
        }),
      );
    }
  }

  return {
    baselineDps: args.tournament.stats.baseline_dps,
    generatedAtMs: args.generatedAtMs ?? Date.now(),
    items,
    jobId: args.jobId,
    kind: "drops",
    note: args.note,
    spec: args.spec,
    v: 1,
    winnerDps: args.tournament.stats.winner_dps,
  };
}

function diffToResultItem(a: DiffArgs): ResultItemDto {
  const identity = a.identityLookup?.(a.slotIndex, a.itemId, a.bonusIdHash);

  return {
    bonusIds: identity?.bonusIds ?? [],
    ci95Half: a.ci95Half,
    craftedStats: identity?.craftedStats ?? [],
    craftingQuality: identity?.craftingQuality,
    dpsDeltaVsBaseline: a.meanDps - a.baselineDps,
    dropLevel: identity?.dropLevel,
    enchantId: identity?.enchantId,
    gemBonusIds: identity?.gemBonusIds ?? [],
    gemIds: identity?.gemIds ?? [],
    itemId: a.itemId,
    itemLevel: identity?.itemLevel,
    meanDps: a.meanDps,
    rank: a.rank,
    slot: resolveSlotSlug(a.slotIndex, a.slotSlugLookup),
    sourceLabel: undefined,
    suffix: identity?.suffix,
    winRate: undefined,
  };
}

function entryToResultItem(a: EntryArgs): ResultItemDto {
  const identity = a.identityLookup?.(
    a.slotIndex,
    a.entry.item_id,
    a.entry.bonus_id_hash,
  );

  return {
    bonusIds: identity?.bonusIds ?? [],
    ci95Half: a.entry.ci95_half,
    craftedStats: identity?.craftedStats ?? [],
    craftingQuality: identity?.craftingQuality,
    dpsDeltaVsBaseline: a.entry.marginal_dps_delta,
    dropLevel: identity?.dropLevel,
    enchantId: identity?.enchantId,
    gemBonusIds: identity?.gemBonusIds ?? [],
    gemIds: identity?.gemIds ?? [],
    itemId: a.entry.item_id,
    itemLevel: identity?.itemLevel,
    meanDps: a.entry.best_perm_dps,
    rank: a.entry.best_perm_rank,
    slot: resolveSlotSlug(a.slotIndex, a.slotSlugLookup),
    sourceLabel: undefined,
    suffix: identity?.suffix,
    winRate: a.entry.win_rate_pct / 100,
  };
}

function resolveSlotSlug(
  slotIndex: number,
  lookup: SlotSlugLookup | undefined,
): string {
  return lookup?.(slotIndex) ?? `slot_${slotIndex}`;
}
