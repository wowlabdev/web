import {
  Activity,
  AtSign,
  BookMarked,
  BookOpen,
  Briefcase,
  Calculator,
  Calendar,
  ChartBar,
  Code,
  Cpu,
  CreditCard,
  FileText,
  FlaskConical,
  Home,
  Info,
  KeyRound,
  LogIn,
  Map,
  MessageSquare,
  Newspaper,
  Package,
  PenLine,
  Play,
  Plug,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  Swords,
  Terminal,
  User,
  Users,
  Video,
  Zap,
} from "lucide-react";

import { env } from "@wowlab/shared/lib/env";
import { DiscordIcon, GitHubIcon } from "@wowlab/shared/lib/icons";

import type { AnyRoute, DynamicRoute, IconName, Route } from "./types";

const icons = {
  Activity,
  AtSign,
  BookMarked,
  BookOpen,
  Briefcase,
  Calculator,
  Calendar,
  ChartBar,
  Code,
  Cpu,
  CreditCard,
  Discord: DiscordIcon,
  FileText,
  FlaskConical,
  GitHub: GitHubIcon,
  Home,
  Info,
  KeyRound,
  LogIn,
  Map,
  MessageSquare,
  Newspaper,
  Package,
  PenLine,
  Play,
  Plug,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  Swords,
  Terminal,
  User,
  Users,
  Video,
  Zap,
} as const;

export function absoluteUrl(
  path: string,
  query?: Record<string, string>,
): string {
  const url = new URL(path, window.location.origin);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export function appUrl(
  path: string = "/",
  query?: Record<string, string>,
): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, env.APP_URL);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export function breadcrumb(
  ...items: (Route | string)[]
): { href?: string; label: string }[] {
  return items.map((item, index) => {
    const isLast = index === items.length - 1;
    const label = typeof item === "string" ? item : item.label;
    const path = typeof item === "string" ? undefined : item.path;

    return isLast ? { label } : { href: path, label };
  });
}

export function getIcon(name: IconName) {
  return icons[name];
}

export function href(route: Route): string;
export function href(
  route: DynamicRoute,
  params: Record<string, string>,
): string;
export function href(route: AnyRoute, params?: Record<string, string>): string {
  if ("template" in route) {
    let result = route.template;

    for (const key of route.params) {
      result = result.replace(`:${key}`, params![key]);
    }

    return result;
  }

  return route.path;
}

export function landingUrl(path: string = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${env.LANDING_URL}${normalizedPath}`;
}

export { getLocalizedUrl } from "intlayer";
