import type { MetadataRoute } from "next";

export type AnyRoute = Route | DynamicRoute;

export type DynamicRoute = {
  template: string;
  params: readonly string[];
  label: string;
  icon: IconName;
  railColor: RailColor;
};

export type IconName =
  | "Activity"
  | "AtSign"
  | "BookMarked"
  | "BookOpen"
  | "Briefcase"
  | "Calculator"
  | "Calendar"
  | "ChartBar"
  | "Code"
  | "Cpu"
  | "CreditCard"
  | "Discord"
  | "FileText"
  | "FlaskConical"
  | "GitHub"
  | "Home"
  | "Info"
  | "KeyRound"
  | "LogIn"
  | "Map"
  | "MessageSquare"
  | "Newspaper"
  | "Package"
  | "PenLine"
  | "Play"
  | "Plug"
  | "Search"
  | "Server"
  | "Settings"
  | "Shield"
  | "Sparkles"
  | "Swords"
  | "Terminal"
  | "User"
  | "Users"
  | "Video"
  | "Zap";

export type IndexedRoute = {
  sitemap: {
    indexed: true;
    changeFrequency: SitemapEntry["changeFrequency"];
    priority: SitemapEntry["priority"];
  };
} & Route;

export type RailColor =
  "amber" | "emerald" | "orange" | "purple" | "slate" | "zinc";

export type Route = {
  path: string;
  label: string;
  description: string;
  icon: IconName;
  railColor: RailColor;
  sitemap: SitemapConfig;
  isPreview: boolean;
  isSearchable: boolean;
  isExternal: boolean;
};

export type SitemapConfig =
  | { indexed: false }
  | {
      indexed: true;
      changeFrequency: SitemapEntry["changeFrequency"];
      priority: SitemapEntry["priority"];
    };

type SitemapEntry = MetadataRoute.Sitemap[number];
