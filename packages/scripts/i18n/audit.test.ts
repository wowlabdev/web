import { describe, expect, it } from "vitest";

import {
  auditDictionaries,
  type Dictionaries,
  type Dictionary,
  parseDictionary,
} from "./audit.ts";

const LOCALES = ["en", "de", "fr"] as const;

describe("translation audit", () => {
  it("accepts matching dictionaries", () => {
    expect(auditDictionaries(fixture(), "en")).toEqual([]);
  });

  it("detects translation drift", () => {
    const dictionaries = fixture({
      fr: `
        "greeting": insert("Bonjour {{person}}"),
        "items": "{{count}} objet",
      `,
    });

    expect(auditDictionaries(dictionaries, "en")).toEqual([
      "fr: example.greeting has placeholders [person], expected [name]",
      "fr: example.items uses text, expected plural",
    ]);
  });

  it("requires one line per entry", () => {
    const dictionary = dictionaryFor(
      "en",
      `
        "items": plural({
          one: "{{count}} item",
          other: "{{count}} items",
        }),
      `,
    );

    expect(dictionary.formatIssues).toEqual([
      "example.content.ts: items must stay on one line",
    ]);
  });
});

function dictionaryFor(locale: string, body: string): Dictionary {
  return parseDictionary(
    `export default ${locale}("example", {${body}});`,
    "example.content.ts",
    locale,
  );
}

function fixture(
  overrides: Partial<Record<(typeof LOCALES)[number], string>> = {},
): Dictionaries {
  const body = `
    "greeting": insert("Hello {{name}}"),
    "items": plural({ one: "{{count}} item", other: "{{count}} items" }),
  `;

  return new Map(
    LOCALES.map((locale) => [
      locale,
      new Map([["example", dictionaryFor(locale, overrides[locale] ?? body)]]),
    ]),
  );
}
