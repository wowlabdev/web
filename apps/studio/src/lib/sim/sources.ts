export type SourceCatalog = {
  instances: SourceInstance[];
};

export type SourceCategory =
  "raids" | "dungeons" | "crafted" | "world" | "vault" | "pvp";

export type SourceCategoryMeta = {
  id: SourceCategory;
  label: string;
  order: number;
};

// eslint-disable-next-line sonarjs/redundant-type-aliases -- exported domain alias consumed by out-of-scope modules; inlining would break their imports
export type SourceId = string;

export type SourceInstance = {
  category: SourceCategory;
  id: SourceId;
  label: string;
  order: number;
};

export const SOURCE_CATEGORIES: readonly SourceCategoryMeta[] = [
  { id: "raids", label: "Raids", order: 1 },
  { id: "dungeons", label: "Dungeons", order: 2 },
  { id: "crafted", label: "Crafted", order: 3 },
  { id: "world", label: "World", order: 4 },
  { id: "vault", label: "Vault", order: 5 },
  { id: "pvp", label: "PvP", order: 6 },
];

export const DEFAULT_SOURCE_CATALOG: SourceCatalog = {
  instances: [
    {
      category: "raids",
      id: "nerubar-palace",
      label: "Nerub'ar Palace",
      order: 1,
    },
    { category: "raids", id: "raids-default", label: "Raids (All)", order: 99 },
    { category: "dungeons", id: "ara-kara", label: "Ara-Kara", order: 1 },
    {
      category: "dungeons",
      id: "city-of-threads",
      label: "City of Threads",
      order: 2,
    },
    { category: "dungeons", id: "grim-batol", label: "Grim Batol", order: 3 },
    {
      category: "dungeons",
      id: "mists-of-tirna-scithe",
      label: "Mists of Tirna Scithe",
      order: 4,
    },
    {
      category: "dungeons",
      id: "dungeons-default",
      label: "Dungeons (All)",
      order: 99,
    },
    {
      category: "crafted",
      id: "crafted-default",
      label: "Crafted (All)",
      order: 1,
    },
    { category: "world", id: "world-default", label: "World (All)", order: 1 },
    { category: "vault", id: "vault-default", label: "Vault (All)", order: 1 },
    { category: "pvp", id: "pvp-default", label: "PvP (All)", order: 1 },
  ],
};

export type Difficulty = "lfr" | "normal" | "heroic" | "mythic";

export const DIFFICULTIES: readonly { id: Difficulty; label: string }[] = [
  { id: "lfr", label: "LFR" },
  { id: "normal", label: "Normal" },
  { id: "heroic", label: "Heroic" },
  { id: "mythic", label: "Mythic" },
];

export const DEFAULT_DIFFICULTY: Difficulty = "heroic";

export function getInstancesByCategory(
  catalog: SourceCatalog,
  category: SourceCategory,
): SourceInstance[] {
  return catalog.instances
    .filter((i) => i.category === category)
    .sort((a, b) => a.order - b.order);
}
