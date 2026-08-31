import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";

export const PREVIEW_FIGHT_STYLES = [
  "Patchwerk",
  "Single",
  "FixedMulti2",
  "FixedMulti5",
] as const;

export type PreviewFightStyle = (typeof PREVIEW_FIGHT_STYLES)[number];

export const PREVIEW_TABS = [
  "overview",
  "character",
  "diagnose",
  "spell",
  "api",
  "envelope",
] as const;

export type PreviewTab = (typeof PREVIEW_TABS)[number];

export const DEFAULT_PREVIEW_ORDER = [
  "dps",
  "timeline",
  "resources",
  "breakdown",
  "auras",
] as const;

export const PREVIEW_QUERY_PARSERS = {
  archetype:
    parseAsStringLiteral(PREVIEW_FIGHT_STYLES).withDefault("Patchwerk"),
  collapsed: parseAsArrayOf(parseAsString).withDefault([]),
  duration: parseAsInteger.withDefault(30),
  order: parseAsArrayOf(parseAsString).withDefault([...DEFAULT_PREVIEW_ORDER]),
  seed: parseAsInteger.withDefault(42),
  tab: parseAsStringLiteral(PREVIEW_TABS).withDefault("overview"),
  targets: parseAsInteger.withDefault(1),
} as const;
