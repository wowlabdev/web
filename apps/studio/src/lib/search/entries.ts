import "server-only";

import { contentIndex } from "@/lib/content/metadata";
import { getSearchableRoutes, routes } from "@wowlab/shared/lib/routing";

import type { SearchEntry } from "./search";

export function getSearchEntries(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const route of getSearchableRoutes()) {
    entries.push({
      category: "Pages",
      description: route.description,
      id: `page:${route.path}`,
      path: route.path,
      title: route.label,
    });
  }

  for (const entry of contentIndex.docs) {
    entries.push({
      category: "Docs",
      description: entry.description,
      id: `doc:${entry.slug}`,
      path: `${routes.dev.docs.index.path}/${entry.slug}`,
      title: entry.title,
    });
  }

  for (const entry of contentIndex.bible) {
    entries.push({
      category: "Bible",
      description: entry.description,
      id: `bible:${entry.slug}`,
      path: `${routes.dev.bible.index.path}/${entry.slug}`,
      title: entry.title,
    });
  }

  return entries;
}
