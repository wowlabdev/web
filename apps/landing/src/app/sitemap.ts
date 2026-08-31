import type { MetadataRoute } from "next";

import { blogSlugs, getBlogPost } from "@/lib/content/blog";
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
} from "@wowlab/shared/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticEntries(), ...blogEntries()];
}

function blogEntries(): SitemapEntry[] {
  return blogSlugs.map((slug) => {
    const post = getBlogPost(slug);

    return entryFor({
      changeFrequency: "monthly",
      lastModified: post?.updatedAt || post?.publishedAt,
      path: href(routes.blog.post, { slug }),
      priority: 0.6,
    });
  });
}

function containsPath(node: unknown, path: string): boolean {
  if (!node || typeof node !== "object") {
    return false;
  }

  if ("path" in node && node.path === path) {
    return true;
  }

  if ("template" in node && node.template === path) {
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

function entryFor(args: {
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: SitemapEntry["priority"];
  lastModified?: string;
}): SitemapEntry {
  return {
    alternates: { languages: languageAlternates("landing", args.path) },
    changeFrequency: args.changeFrequency,
    lastModified: args.lastModified,
    priority: args.priority,
    url: canonicalUrl("landing", DEFAULT_LOCALE, args.path),
  };
}

function isLandingRoute(route: Route | DynamicRoute): boolean {
  const path = "template" in route ? route.template : route.path;

  return LANDING_TOP_LEVEL.some((key) => containsPath(routes[key], path));
}

function staticEntries(): SitemapEntry[] {
  return collectRoutes(routes)
    .filter((r) => r.isSearchable && !r.isExternal && isLandingRoute(r))
    .map((route) =>
      entryFor({
        changeFrequency: route.sitemap.indexed
          ? route.sitemap.changeFrequency
          : "monthly",
        path: href(route),
        priority: route.sitemap.indexed ? route.sitemap.priority : 0.5,
      }),
    );
}
