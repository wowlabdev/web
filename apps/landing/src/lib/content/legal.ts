import type { Metadata } from "next";

import { type LegalPage, legal as veliteLegal } from "#content";
import { notFound } from "next/navigation";
import { cache } from "react";

import type { Route } from "@wowlab/shared/lib/routing";

import { sectionMetadata } from "@wowlab/shared/lib/seo";

export type { LegalPage } from "#content";

export type LegalSlug = "imprint" | "privacy" | "terms";

const entries: Record<string, LegalPage> = {};

for (const entry of veliteLegal) {
  const slug = entry.slug.replace(/^legal\//, "");

  entries[slug] = entry;
}

const getEntry = (slug: string): LegalPage | undefined => entries[slug];

const getPageData = cache((slug: string): LegalPage => {
  const entry = getEntry(slug);

  if (!entry) {
    notFound();
  }

  return entry;
});

export const legal = {
  entries,
  getEntry,
  getPageData,
};

export function legalMetadata(
  slug: LegalSlug,
  locale: string,
  route: Route,
): Metadata {
  const page = getPageData(slug);

  return sectionMetadata({
    description: page.description,
    host: "landing",
    locale,
    route,
    title: page.title,
  });
}
