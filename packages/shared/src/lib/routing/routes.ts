import { env } from "@wowlab/shared/lib/env";

import type {
  AnyRoute,
  DynamicRoute,
  IconName,
  RailColor,
  Route,
  SitemapConfig,
} from "./types";

import { GITHUB_ORGANIZATION_URL } from "./external";

type BaseAny = BaseRoute | BaseDynamic;
type BaseDynamic = Omit<DynamicRoute, "railColor">;
type BaseRoute = Omit<Route, "railColor">;

type RouteGroup = { index: BaseRoute } & Record<
  string,
  BaseAny | Record<string, BaseAny>
>;

type WithRail<T> = T extends BaseRoute
  ? Route
  : T extends BaseDynamic
    ? DynamicRoute
    : T extends object
      ? { [K in keyof T]: WithRail<T[K]> }
      : T;

const SITEMAP = {
  daily: { changeFrequency: "daily", indexed: true, priority: 0.8 },
  disabled: { indexed: false },
  monthly: { changeFrequency: "monthly", indexed: true, priority: 0.6 },
  weekly: { changeFrequency: "weekly", indexed: true, priority: 0.7 },
} as const satisfies Record<string, SitemapConfig>;

type RouteConfig = {
  path: string;
  label: string;
  description: string;
  icon: IconName;
  sitemap?: SitemapConfig;
  isPreview?: boolean;
  isSearchable?: boolean;
  isExternal?: boolean;
};

function applyRailColor<T>(value: T, rail: RailColor): T {
  if (!value || typeof value !== "object") {
    return value;
  }

  if ("icon" in value) {
    return { ...value, railColor: rail } as T;
  }

  const result: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    result[key] = applyRailColor(entry, rail);
  }

  return result as T;
}

function dynamic({
  icon,
  label,
  params,
  template,
}: {
  template: string;
  params: readonly string[];
  label: string;
  icon: IconName;
}): Omit<DynamicRoute, "railColor"> {
  return { icon, label, params, template };
}

function group<T extends RouteGroup>(routes: T, rail: RailColor): WithRail<T> {
  return applyRailColor(routes, rail) as unknown as WithRail<T>;
}

function route({
  description,
  icon,
  isExternal = false,
  isPreview = false,
  isSearchable = true,
  label,
  path,
  sitemap: sitemapConfig = SITEMAP.disabled,
}: RouteConfig): Omit<Route, "railColor"> {
  return {
    description,
    icon,
    isExternal,
    isPreview,
    isSearchable,
    label,
    path,
    sitemap: sitemapConfig,
  };
}

function standalone<T extends AnyRoute>(
  route: Omit<T, "railColor">,
  rail: RailColor,
): T {
  return { ...route, railColor: rail } as T;
}

/* eslint-disable perfectionist/sort-objects -- route insertion order defines navigation order */
export const routes = {
  home: standalone(
    route({
      path: "/",
      label: "Home",
      description: "Precision simulation workspace for WoW theorycrafting",
      icon: "Home",
      sitemap: SITEMAP.weekly,
    }),
    "slate",
  ),

  journal: standalone(
    route({
      path: "/journal",
      label: "Journal",
      description: "Browse mocked raid and dungeon loot surfaces",
      icon: "BookOpen",
      isSearchable: false,
    }),
    "purple",
  ),

  int: group(
    {
      index: route({
        path: "/int",
        label: "Internal",
        description: "Internal operations and developer utilities",
        icon: "FlaskConical",
        isSearchable: false,
      }),
      runtime: route({
        path: "/int/runtime",
        label: "Runtime",
        description: "Browser worker pool and local game-data storage",
        icon: "Cpu",
      }),
      metrics: route({
        path: "/int/metrics",
        label: "Metrics",
        description: "Operational telemetry and service health",
        icon: "Activity",
      }),
      hooks: route({
        path: "/int/hooks",
        label: "Hooks",
        description: "Structured game-data access and lookup tools",
        icon: "FlaskConical",
      }),
      permutations: route({
        path: "/int/permutations",
        label: "Permutations",
        description: "Gear permutation space explorer for Best in Bags",
        icon: "Package",
        isSearchable: false,
      }),
      ui: route({
        path: "/int/ui",
        label: "UI Showcase",
        description: "Component primitives and design token surfaces",
        icon: "Sparkles",
      }),
    },
    "amber",
  ),

  admin: group(
    {
      index: route({
        path: "/admin",
        label: "Admin",
        description: "Admin panel",
        icon: "Shield",
        isSearchable: false,
      }),
      overview: route({
        path: "/admin/overview",
        label: "Overview",
        description: "Admin overview",
        icon: "Shield",
        isSearchable: false,
      }),
      handles: route({
        path: "/admin/handles",
        label: "Reserved Handles",
        description: "Manage reserved usernames",
        icon: "AtSign",
        isSearchable: false,
      }),
      paperdolls: route({
        path: "/admin/paperdolls",
        label: "Paperdolls",
        description: "Import and manage example characters per spec",
        icon: "User",
        isSearchable: false,
      }),
      fleet: route({
        path: "/admin/fleet",
        label: "Fleet",
        description: "Tailnet node fleet management",
        icon: "Server",
        isSearchable: false,
      }),
      seasons: route({
        path: "/admin/seasons",
        label: "Seasons",
        description: "Manage simulation seasons",
        icon: "Calendar",
        isSearchable: false,
      }),
      actions: route({
        path: "/admin/actions",
        label: "Actions",
        description: "System actions and triggers",
        icon: "Play",
        isSearchable: false,
      }),
      shortUrls: route({
        path: "/admin/short-urls",
        label: "Short URLs",
        description: "Generate and review short links",
        icon: "AtSign",
        isSearchable: false,
      }),
      bunny: route({
        path: "/admin/bunny",
        label: "Bunny",
        description: "Bunny.net video library stats",
        icon: "Video",
        isSearchable: false,
      }),
      billing: {
        index: route({
          path: "/admin/billing",
          label: "Billing",
          description: "Subscriptions, transactions, refunds",
          icon: "CreditCard",
          isSearchable: false,
        }),
        customer: dynamic({
          template: "/admin/billing/customers/:id",
          params: ["id"],
          label: "Customer",
          icon: "User",
        }),
      },
      tools: route({
        path: "/admin/tools",
        label: "Tools",
        description: "Admin utilities",
        icon: "Terminal",
        isSearchable: false,
      }),
      settings: route({
        path: "/admin/settings",
        label: "Settings",
        description: "Global configuration",
        icon: "Settings",
        isSearchable: false,
      }),
    },
    "purple",
  ),

  auth: group(
    {
      index: route({
        path: "/auth",
        label: "Auth",
        description: "Authentication",
        icon: "KeyRound",
        isSearchable: false,
      }),
      signIn: route({
        path: "/auth/sign-in",
        label: "Sign In",
        description: "Sign in",
        icon: "LogIn",
        isSearchable: false,
      }),
    },
    "zinc",
  ),

  account: group(
    {
      index: route({
        path: "/account",
        label: "Account",
        description: "Your account",
        icon: "User",
      }),
      billing: {
        index: route({
          path: "/account/billing",
          label: "Billing",
          description: "Subscription and boost balance",
          icon: "CreditCard",
        }),
        checkout: route({
          path: "/account/billing/checkout",
          label: "Checkout",
          description: "Complete your purchase",
          icon: "CreditCard",
          isSearchable: false,
        }),
      },
      settings: route({
        path: "/account/settings",
        label: "Settings",
        description: "Account settings",
        icon: "Settings",
      }),
      friends: {
        index: route({
          path: "/account/friends",
          label: "Friends",
          description: "Manage friend lists",
          icon: "Users",
        }),
      },
    },
    "zinc",
  ),

  friends: {
    join: standalone(
      dynamic({
        template: "/friends/join/:code",
        params: ["code"],
        label: "Join Friend List",
        icon: "Users",
      }),
      "zinc",
    ),
  },

  inspect: group(
    {
      index: route({
        path: "/inspect",
        label: "Inspect",
        description: "Inspect game data entries",
        icon: "Search",
        isSearchable: false,
      }),
      spell: dynamic({
        template: "/inspect/spell/:id",
        params: ["id"],
        label: "Spell",
        icon: "Sparkles",
      }),
      item: dynamic({
        template: "/inspect/item/:id",
        params: ["id"],
        label: "Item",
        icon: "Package",
      }),
    },
    "purple",
  ),

  users: {
    profile: standalone(
      dynamic({
        template: "/users/:handle",
        params: ["handle"],
        label: "User Profile",
        icon: "User",
      }),
      "zinc",
    ),
  },

  pricing: standalone(
    route({
      path: "/pricing",
      label: "Pricing",
      description: "Plans and pricing",
      icon: "CreditCard",
      sitemap: SITEMAP.monthly,
    }),
    "zinc",
  ),

  about: group(
    {
      contact: route({
        path: "/contact",
        label: "Contact",
        description: "Support, billing help, and project contact paths",
        icon: "MessageSquare",
        sitemap: SITEMAP.monthly,
      }),
      imprint: route({
        path: "/imprint",
        label: "Imprint",
        description: "Legal notice under §5 DDG",
        icon: "FileText",
        sitemap: SITEMAP.monthly,
      }),
      index: route({
        path: "/about",
        label: "About",
        description: "Project principles, scope, and operating model",
        icon: "Info",
        sitemap: SITEMAP.monthly,
      }),
      privacy: route({
        path: "/privacy",
        label: "Privacy Policy",
        description: "Privacy Policy",
        icon: "Shield",
        sitemap: SITEMAP.monthly,
      }),
      terms: route({
        path: "/terms",
        label: "Terms of Service",
        description: "Terms of Service",
        icon: "FileText",
        sitemap: SITEMAP.monthly,
      }),
    },
    "orange",
  ),

  simulate: group(
    {
      index: route({
        path: "/simulate",
        label: "Simulate",
        description: "Run reproducible combat simulations and compare outcomes",
        icon: "Play",
        sitemap: SITEMAP.weekly,
      }),
      quick: route({
        path: "/simulate/quick",
        label: "Quick Sim",
        description: "Fast baseline simulation for immediate decisions",
        icon: "Zap",
      }),
      drops: route({
        path: "/simulate/drops",
        label: "Drop Optimizer",
        description: "Score loot drops against your active build",
        icon: "Package",
      }),
      bags: route({
        path: "/simulate/bags",
        label: "Best in Bags",
        description: "Search your inventory space for top-performing sets",
        icon: "Briefcase",
      }),
      mockBags: route({
        path: "/simulate/mock-bags",
        label: "Mock Bags",
        description: "Progressive best-in-bags visualization prototype",
        icon: "FlaskConical",
        isSearchable: false,
      }),
      character: route({
        path: "/simulate/character",
        label: "Character",
        description: "Manage your saved characters and the active paperdoll",
        icon: "User",
        sitemap: SITEMAP.disabled,
        isSearchable: false,
      }),
      results: dynamic({
        template: "/simulate/results/:id",
        params: ["id"],
        label: "Results",
        icon: "ChartBar",
      }),
    },
    "amber",
  ),

  rankings: group(
    {
      index: route({
        path: "/rankings",
        label: "Rankings",
        description: "Cross-spec performance snapshots from simulation data",
        icon: "ChartBar",
        sitemap: SITEMAP.weekly,
      }),
      specs: route({
        path: "/rankings/specs",
        label: "Specs",
        description: "Spec-level trend board with normalized comparison",
        icon: "Activity",
        sitemap: SITEMAP.weekly,
      }),
      items: route({
        path: "/rankings/items",
        label: "Items",
        description: "Item impact trends across sampled profiles",
        icon: "Package",
        sitemap: SITEMAP.monthly,
        isPreview: true,
      }),
    },
    "amber",
  ),

  rotations: group(
    {
      index: route({
        path: "/rotations",
        label: "Rotations",
        description: "Action priority workflows and validation",
        icon: "Swords",
        sitemap: SITEMAP.weekly,
      }),
      browse: route({
        path: "/rotations/browse",
        label: "Browse",
        description: "Discover and inspect community-built rotations",
        icon: "Search",
        sitemap: SITEMAP.weekly,
      }),
      view: dynamic({
        template: "/rotations/:id",
        params: ["id"],
        label: "View Rotation",
        icon: "Swords",
      }),
      editor: {
        index: route({
          path: "/rotations/editor",
          label: "New Rotation",
          description: "Author a structured action priority list",
          icon: "PenLine",
        }),
        edit: dynamic({
          template: "/rotations/editor/:id",
          params: ["id"],
          label: "Edit Rotation",
          icon: "PenLine",
        }),
      },
    },
    "emerald",
  ),

  plan: group(
    {
      index: route({
        path: "/plan",
        label: "Plan",
        description: "Character planning with simulation-aware context",
        icon: "Calculator",
        sitemap: SITEMAP.monthly,
      }),
      traits: route({
        path: "/plan/traits",
        label: "Traits",
        description: "Trait routing and allocation planner",
        icon: "Sparkles",
        sitemap: SITEMAP.monthly,
        isPreview: true,
      }),
      routes: route({
        path: "/plan/routes",
        label: "Routes",
        description: "Mythic+ dungeon route map and pull planner",
        icon: "Map",
        sitemap: SITEMAP.monthly,
        isPreview: true,
      }),
    },
    "emerald",
  ),

  blog: group(
    {
      index: route({
        path: "/blog",
        label: "Blog",
        description: "Release notes, field reports, and platform updates",
        icon: "Newspaper",
        sitemap: SITEMAP.weekly,
      }),
      post: dynamic({
        template: "/blog/:slug",
        params: ["slug"],
        label: "Blog Post",
        icon: "FileText",
      }),
    },
    "orange",
  ),

  discord: group(
    {
      index: route({
        path: env.DISCORD_URL,
        label: "Discord",
        description: "Community chat and support",
        icon: "Discord",
        isSearchable: false,
        isExternal: true,
      }),
    },
    "zinc",
  ),

  github: group(
    {
      index: route({
        path: GITHUB_ORGANIZATION_URL,
        label: "GitHub",
        description: "Source code and issue tracker",
        icon: "GitHub",
        isSearchable: false,
        isExternal: true,
      }),
    },
    "zinc",
  ),

  dev: group(
    {
      index: route({
        path: "/dev",
        label: "Developer",
        description: "Engineering consoles and implementation references",
        icon: "Code",
        sitemap: SITEMAP.monthly,
      }),
      addon: route({
        path: "/dev/addon",
        label: "Addon",
        description: "Companion addon download and slash command reference",
        icon: "Package",
      }),
      bible: {
        index: route({
          path: "/dev/bible",
          label: "Bible",
          description: "Deep technical reference for simulation internals",
          icon: "BookMarked",
          sitemap: SITEMAP.weekly,
        }),
        page: dynamic({
          template: "/dev/bible/:slug",
          params: ["slug"],
          label: "Bible Page",
          icon: "FileText",
        }),
      },
      docs: {
        index: route({
          path: "/dev/docs",
          label: "Docs",
          description: "Implementation docs and system architecture",
          icon: "BookOpen",
          sitemap: SITEMAP.weekly,
        }),
        page: dynamic({
          template: "/dev/docs/:slug",
          params: ["slug"],
          label: "Doc Page",
          icon: "FileText",
        }),
      },
      engine: route({
        path: "/dev/engine",
        label: "Engine",
        description: "Engine behavior sandbox and diagnostics",
        icon: "Cpu",
      }),
      mcp: route({
        path: "/dev/mcp",
        label: "MCP Server",
        description: "Model context protocol setup and connectivity",
        icon: "Plug",
      }),
      paperdolls: route({
        path: "/dev/paperdolls",
        label: "Paperdolls",
        description: "Example character per spec with gear and talents",
        icon: "User",
      }),
    },
    "purple",
  ),

  error: standalone(
    route({
      path: "/error",
      label: "Error",
      description: "Something went wrong",
      icon: "Info",
      isSearchable: false,
    }),
    "slate",
  ),
  notFound: standalone(
    route({
      path: "/404",
      label: "Not Found",
      description: "Page not found",
      icon: "Info",
      isSearchable: false,
    }),
    "slate",
  ),
  unauthorized: standalone(
    route({
      path: "/unauthorized",
      label: "Sign In Required",
      description: "Sign in required",
      icon: "LogIn",
      isSearchable: false,
    }),
    "zinc",
  ),
} as const;
/* eslint-enable perfectionist/sort-objects */

export const LANDING_TOP_LEVEL = [
  "about",
  "blog",
  "home",
  "pricing",
] as const satisfies readonly (keyof typeof routes)[];
