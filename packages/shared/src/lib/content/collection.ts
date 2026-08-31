import { capitalCase } from "change-case";
import { notFound } from "next/navigation";
import { cache } from "react";

import type { NavItem, TocEntry } from "./types";

import { stripNumbers, stripPrefix } from "./paths";
import { createNavItem, getAdjacentItems } from "./utils";

export type ContentSection = {
  slug: string;
  title: string;
  order: number;
  children?: ContentSection[];
};

type VeliteEntry = {
  body: string;
  description: string;
  metadata: { readingTime?: number; wordCount?: number };
  nextSteps?: string[];
  raw: string;
  slug: string;
  sortKey: string;
  title: string;
  toc: TocEntry[];
  updatedAt: string;
};

const toTitle = (s: string) => capitalCase(s.replace(/^\d+-/, ""));

const extractOrder = (segment: string, collectionName: string): number => {
  const match = /^(\d+)-/.exec(segment);

  // docref:start content-system-extract-order-guard
  if (!match) {
    throw new Error(
      `${collectionName} path segment missing number prefix: ${segment}`,
    );
  }
  // docref:end content-system-extract-order-guard

  return Number.parseInt(match[1], 10);
};

export function createContentCollection<T extends VeliteEntry>(
  veliteEntries: T[],
  prefix: string,
  basePath: string,
) {
  const entriesMap: Record<string, T> = {};
  const sortKeyToSlug: Record<string, string> = {};

  for (const entry of veliteEntries) {
    const sortKey = stripPrefix(entry.sortKey, prefix);
    const cleanSlug = stripNumbers(sortKey);

    entriesMap[cleanSlug] = entry;
    sortKeyToSlug[sortKey] = cleanSlug;
  }

  const slugToSortKey = Object.fromEntries(
    Object.entries(sortKeyToSlug).map(([sk, slug]) => [slug, sk]),
  );

  const slugs = Object.entries(sortKeyToSlug)
    .sort(([a], [b]) => {
      const diff = a.split("/").length - b.split("/").length;

      return diff === 0 ? a.localeCompare(b) : diff;
    })
    .map(([, cleanSlug]) => cleanSlug);

  const getEntry = (slug: string): T | undefined => entriesMap[slug];

  const resolveNumberedPath = (numberedPath: string): string | undefined =>
    sortKeyToSlug[numberedPath];

  const index = (() => {
    const entries = new Map<string, ContentSection>();

    for (const slug of slugs) {
      const sortKey = slugToSortKey[slug]!;
      const [key, ...rest] = slug.split("/");
      const sortKeySegments = sortKey.split("/");
      const isRoot = rest.length === 0;

      if (isRoot) {
        const order = extractOrder(sortKeySegments[0]!, prefix);

        entries.set(key, { order, slug, title: getEntry(slug)!.title });
        continue;
      }

      if (!entries.has(key)) {
        const order = extractOrder(sortKeySegments[0]!, prefix);

        entries.set(key, {
          children: [],
          order,
          slug: key,
          title: toTitle(sortKeySegments[0]!),
        });
      }

      const section = entries.get(key)!;
      const childOrder = extractOrder(sortKeySegments[1]!, prefix);

      section.children!.push({
        order: childOrder,
        slug,
        title: getEntry(slug)!.title,
      });
    }

    return [...entries.values()].sort((a, b) => a.order - b.order);
  })();

  const getNavMeta = (slug: string): NavItem => {
    const entry = getEntry(slug);

    return entry ? createNavItem(slug, entry.title, basePath) : null;
  };

  const getFirstSlug = () => slugs[0]!;

  const resolveNextSteps = (numberedPaths?: string[]): NonNullable<NavItem>[] =>
    (numberedPaths ?? [])
      .map((numberedPath) => {
        const cleanSlug = resolveNumberedPath(numberedPath);

        return cleanSlug ? getNavMeta(cleanSlug) : null;
      })
      .filter((item): item is NonNullable<NavItem> => item !== null);

  const getPageData = cache(async (slug: string[]) => {
    const fullSlug = slug.join("/");
    const entry = getEntry(fullSlug);

    if (!entry) {
      notFound();
    }

    const { next, prev } = getAdjacentItems(slugs, fullSlug, getNavMeta);
    const sortKey = stripPrefix(entry.sortKey, prefix);

    return {
      body: entry.body,
      description: entry.description,
      fullSlug,
      metadata: entry.metadata,
      next,
      nextSteps: resolveNextSteps(entry.nextSteps),
      prev,
      raw: entry.raw,
      sortKey,
      title: entry.title,
      toc: entry.toc,
      updatedAt: entry.updatedAt,
    };
  });

  return {
    entries: entriesMap,
    getEntry,
    getFirstSlug,
    getNavMeta,
    getPageData,
    index,
    resolveNextSteps,
    resolveNumberedPath,
    slugs,
  };
}
