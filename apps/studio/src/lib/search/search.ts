import MiniSearch from "minisearch";

export type SearchEntry = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
};

export function createSearchIndex(entries: SearchEntry[]) {
  const entryMap = new Map<string, SearchEntry>();

  for (const entry of entries) {
    entryMap.set(entry.id, entry);
  }

  const miniSearch = new MiniSearch<SearchEntry>({
    fields: ["title", "description"],
    idField: "id",
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  miniSearch.addAll(entries);

  return function search(query: string, limit = 10): SearchEntry[] {
    if (!query.trim()) {
      return [];
    }

    return miniSearch
      .search(query)
      .slice(0, limit)
      .map((result) => entryMap.get(result.id as string))
      .filter((entry): entry is SearchEntry => entry != null);
  };
}
