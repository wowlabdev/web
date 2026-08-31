import type { MetadataRoute } from "next";

import { contentIndex, type ContentMetadata } from "@/lib/content/metadata";
import {
  type DynamicRoute,
  href,
  LANDING_TOP_LEVEL,
  type Route,
  routes,
} from "@wowlab/shared/lib/routing";
import { collectRoutes } from "@wowlab/shared/lib/routing/nav";
import {
  canonicalUrl,
  DEFAULT_LOCALE,
  languageAlternates,
  type SeoHost,
} from "@wowlab/shared/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticEntries(),
    studioHomeEntry(),
    ...contentEntries(contentIndex.docs, routes.dev.docs.page),
    ...contentEntries(contentIndex.bible, routes.dev.bible.page),
  ];
}

function containsPath(node: unknown, path: string): boolean {
  if (!node || typeof node !== "object") {
    return false;
  }

  if ("path" in node && (node as Route).path === path) {
    return true;
  }

  if ("template" in node && (node as DynamicRoute).template === path) {
    return true;
  }

  for (const [k, v] of Object.entries(node)) {
    if (k === "_nav") {
      continue;
    }

    if (containsPath(v, path)) {
      return true;
    }
  }

  return false;
}

function contentEntries(
  entries: readonly ContentMetadata[],
  pageRoute: DynamicRoute,
): SitemapEntry[] {
  return entries.map((entry) => {
    return entryFor({
      changeFrequency: "monthly",
      lastModified: entry.updatedAt,
      path: href(pageRoute, { slug: entry.slug }),
      priority: 0.6,
      route: pageRoute,
    });
  });
}

function entryFor(args: {
  route: Route | DynamicRoute;
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: SitemapEntry["priority"];
  lastModified?: string;
}): SitemapEntry {
  const host = hostFor(args.route);

  return {
    alternates: { languages: languageAlternates(host, args.path) },
    changeFrequency: args.changeFrequency,
    lastModified: args.lastModified,
    priority: args.priority,
    url: canonicalUrl(host, DEFAULT_LOCALE, args.path),
  };
}

function hostFor(route: Route | DynamicRoute): SeoHost {
  const path = "template" in route ? route.template : route.path;

  for (const key of LANDING_TOP_LEVEL) {
    if (containsPath(routes[key], path)) {
      return "landing";
    }
  }

  return "app";
}

function staticEntries(): SitemapEntry[] {
  return collectRoutes(routes)
    .filter((r) => r.isSearchable && !r.isExternal)
    .map((route) =>
      entryFor({
        changeFrequency: route.sitemap.indexed
          ? route.sitemap.changeFrequency
          : "monthly",
        path: href(route),
        priority: route.sitemap.indexed ? route.sitemap.priority : 0.5,
        route,
      }),
    );
}

function studioHomeEntry(): SitemapEntry {
  const path = href(routes.home);

  return {
    alternates: { languages: languageAlternates("app", path) },
    changeFrequency: "weekly",
    priority: 0.7,
    url: canonicalUrl("app", DEFAULT_LOCALE, path),
  };
}
