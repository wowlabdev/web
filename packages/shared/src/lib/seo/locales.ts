import type { Locale } from "intlayer";

export const DEFAULT_LOCALE = "en" satisfies Locale;
export const LOCALES = ["en", "de", "fr"] as const satisfies readonly Locale[];

const OG_LOCALE_MAP: Record<string, string> = {
  de: "de_DE",
  en: "en_US",
  fr: "fr_FR",
};

export function ogLocale(locale: string): string {
  return OG_LOCALE_MAP[locale] ?? locale;
}
