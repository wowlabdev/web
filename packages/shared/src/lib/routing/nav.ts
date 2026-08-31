import type { IndexedRoute, Route } from "./types";

import { routes } from "./routes";

export type NavGroup = { route: Route; items: readonly Route[] };

export type NavSection = {
  key: NavSectionKey;
  isExternal: boolean;
  groups: readonly NavGroup[];
};

export type NavSectionKey = "core" | "developer" | "internal" | "external";

export const navigation = [
  {
    groups: [
      {
        items: [
          routes.simulate.quick,
          routes.simulate.bags,
          routes.simulate.drops,
          routes.simulate.character,
        ],
        route: routes.simulate.index,
      },
      {
        items: [routes.rotations.browse, routes.rotations.editor.index],
        route: routes.rotations.index,
      },
      {
        items: [routes.plan.traits, routes.plan.routes],
        route: routes.plan.index,
      },
      {
        items: [routes.rankings.specs, routes.rankings.items],
        route: routes.rankings.index,
      },
      { items: [], route: routes.journal },
    ],
    isExternal: false,
    key: "core",
  },
  {
    groups: [
      { items: [], route: routes.dev.docs.index },
      { items: [], route: routes.dev.bible.index },
      { items: [], route: routes.dev.engine },
      { items: [], route: routes.dev.paperdolls },
      { items: [], route: routes.dev.addon },
      { items: [], route: routes.dev.mcp },
    ],
    isExternal: false,
    key: "developer",
  },
  {
    groups: [
      { items: [], route: routes.int.runtime },
      { items: [], route: routes.int.metrics },
      { items: [], route: routes.int.hooks },
      { items: [], route: routes.int.permutations },
      { items: [], route: routes.int.ui },
    ],
    isExternal: false,
    key: "internal",
  },
  {
    groups: [
      { items: [], route: routes.discord.index },
      { items: [], route: routes.github.index },
    ],
    isExternal: true,
    key: "external",
  },
] as const satisfies readonly NavSection[];

export function collectRoutes(obj: unknown): Route[] {
  if (!obj || typeof obj !== "object") {
    return [];
  }

  if (isRoute(obj)) {
    return [obj];
  }

  return Object.values(obj).flatMap((value) => collectRoutes(value));
}

export function getDisallowedPaths(): string[] {
  const paths = collectRoutes(routes)
    .filter((r) => !r.sitemap.indexed)
    .map((r) => r.path)
    .sort((a, b) => a.length - b.length);

  return paths
    .filter(
      (path, _, all) => !all.some((p) => p !== path && path.startsWith(p)),
    )
    .map((p) => `${p}/`);
}

export function getSitemapRoutes(): IndexedRoute[] {
  return collectRoutes(routes).filter(
    (r): r is IndexedRoute => r.sitemap.indexed,
  );
}

function isRoute(value: unknown): value is Route {
  return typeof value === "object" && value !== null && "path" in value;
}

const allRoutes = collectRoutes(routes);

export function getRouteByPath(pathname: string): Route | undefined {
  return allRoutes.find(
    (r) => pathname === r.path || pathname.startsWith(`${r.path}/`),
  );
}

export function getSearchableRoutes(): Route[] {
  return allRoutes.filter((r) => r.isSearchable);
}
