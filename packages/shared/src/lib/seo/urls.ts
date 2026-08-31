import {
  appUrl,
  getLocalizedUrl,
  landingUrl,
} from "@wowlab/shared/lib/routing";

import { DEFAULT_LOCALE, LOCALES } from "./locales";

export type SeoHost = "app" | "landing";

export function canonicalUrl(
  host: SeoHost,
  locale: string,
  path: string,
): string {
  return hostUrl(host, getLocalizedUrl(path, locale));
}

export function hostUrl(host: SeoHost, path: string): string {
  return host === "landing" ? landingUrl(path) : appUrl(path);
}

export function languageAlternates(
  host: SeoHost,
  path: string,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const locale of LOCALES) {
    result[locale] = hostUrl(host, getLocalizedUrl(path, locale));
  }

  result["x-default"] = hostUrl(host, getLocalizedUrl(path, DEFAULT_LOCALE));

  return result;
}
