import type { JournalEncounter, JournalSource } from "./types";

export const ARCHIVE_PAGE_SIZE = 24;

export type JournalTreeModel = {
  hiddenArchiveCount: number;
  matchingEncounterCount: number;
  rows: JournalTreeRow[];
};

export type JournalTreeRow =
  | {
      encounter: JournalEncounter;
      id: string;
      isLastEncounter: boolean;
      kind: "encounter";
      source: JournalSource;
    }
  | { id: string; kind: "source"; source: JournalSource }
  | { count: number; id: string; kind: "tier"; name: string };

export function buildJournalTreeModel({
  archiveLimit,
  query,
  sources,
}: {
  archiveLimit: number;
  query: string;
  sources: JournalSource[];
}): JournalTreeModel {
  const needle = query.trim().toLowerCase();
  const filtered = needle ? filterSources(sources, needle) : sources;
  const current = filtered.filter((source) => source.isCurrentSeason);
  const archive = filtered.filter((source) => !source.isCurrentSeason);
  const visibleArchive = needle ? archive : archive.slice(0, archiveLimit);
  const hiddenCount = Math.max(0, archive.length - visibleArchive.length);
  const visibleSources = [...current, ...visibleArchive];
  const matchingEncounterCount = visibleSources.reduce(
    (sum, source) => sum + source.encounters.length,
    0,
  );

  return {
    hiddenArchiveCount: needle ? 0 : hiddenCount,
    matchingEncounterCount,
    rows: [
      ...rowsForSources("Current Season", current),
      ...groupedArchiveRows(visibleArchive),
    ],
  };
}

function filterSources(sources: JournalSource[], needle: string) {
  return sources.filter(
    (source) =>
      source.name.toLowerCase().includes(needle) ||
      source.tier.toLowerCase().includes(needle) ||
      source.encounters.some((encounter) =>
        encounter.name.toLowerCase().includes(needle),
      ),
  );
}

function groupByTier(sources: JournalSource[]) {
  const groups = new Map<
    string,
    { id: string; name: string; order: number; sources: JournalSource[] }
  >();

  for (const source of sources) {
    const id = `${source.tierId}:${source.tier}`;
    const group = groups.get(id) ?? {
      id,
      name: source.tier,
      order: source.tierId,
      sources: [],
    };

    group.sources.push(source);
    groups.set(id, group);
  }

  return [...groups.values()].sort((a, b) => b.order - a.order);
}

function groupedArchiveRows(sources: JournalSource[]) {
  return groupByTier(sources).flatMap((tier) =>
    rowsForSources(tier.name, tier.sources),
  );
}

function rowsForSources(tierName: string, sources: JournalSource[]) {
  if (sources.length === 0) {
    return [];
  }

  return [
    {
      count: sources.length,
      id: `tier:${tierName}`,
      kind: "tier" as const,
      name: tierName,
    },
    ...sources.flatMap((source) => [
      { id: `source:${source.id}`, kind: "source" as const, source },
      ...source.encounters.map((encounter, index) => ({
        encounter,
        id: `encounter:${source.id}:${encounter.id}`,
        isLastEncounter: index === source.encounters.length - 1,
        kind: "encounter" as const,
        source,
      })),
    ]),
  ];
}
