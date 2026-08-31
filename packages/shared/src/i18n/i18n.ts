import { type Dictionary, Locales } from "intlayer";

type Flat = Record<string, unknown>;
type Locale = (typeof Locales)[keyof typeof Locales];
type Nested = { [key: string]: unknown };

function expand(flat: Flat): Nested {
  const root: Nested = {};

  for (const [path, value] of Object.entries(flat)) {
    const keys = path.split(".");
    const leaf = keys.pop()!;
    const parent = keys.reduce<Nested>((node, key) => {
      if (!isNested(node[key])) {
        node[key] = {};
      }

      return node[key] as Nested;
    }, root);

    parent[leaf] = value;
  }

  return root;
}

function isNested(value: unknown): value is Nested {
  return typeof value === "object" && value !== null;
}

const makeDict =
  (locale: Locale) =>
  <K extends string>(key: K, flat: Flat): Dictionary =>
    ({ content: expand(flat), key, locale }) as Dictionary;

export const en = makeDict(Locales.ENGLISH);

export const de = makeDict(Locales.GERMAN);

export const fr = makeDict(Locales.FRENCH);
