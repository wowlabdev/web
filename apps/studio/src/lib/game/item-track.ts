export const ITEM_LEVEL_TRACKS = [
  { minItemLevel: 0, name: "Veteran" },
  { minItemLevel: 694, name: "Champion" },
  { minItemLevel: 707, name: "Hero" },
  { minItemLevel: 720, name: "Myth" },
] as const;

export type ItemLevelTrack = (typeof ITEM_LEVEL_TRACKS)[number]["name"];

export function resolveItemLevelTrack(itemLevel: number): ItemLevelTrack {
  for (let index = ITEM_LEVEL_TRACKS.length - 1; index >= 0; index -= 1) {
    const tier = ITEM_LEVEL_TRACKS[index];

    if (itemLevel >= tier.minItemLevel) {
      return tier.name;
    }
  }

  return ITEM_LEVEL_TRACKS[0].name;
}
