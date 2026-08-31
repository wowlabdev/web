import type { SpellDescFragment, SpellRenderInput } from "wowlab-common";

import { describe, expect, it } from "vitest";

import { renderSpellDescWithData } from "@/lib/wasm/api";

import { loadCommon } from "./__fixtures__/load-common";
import fixture108359 from "./__fixtures__/spell_render/108359.json";
import fixture202782 from "./__fixtures__/spell_render/202782.json";
import fixture302500 from "./__fixtures__/spell_render/302500.json";
import fixture30451 from "./__fixtures__/spell_render/30451.json";
import fixture315341 from "./__fixtures__/spell_render/315341.json";
import fixture42955 from "./__fixtures__/spell_render/42955.json";
import fixture43265 from "./__fixtures__/spell_render/43265.json";
import fixture703 from "./__fixtures__/spell_render/703.json";

// Mirrors the Rust/forge `flatten` so golden text comparisons stay in sync.
function flatten(fragments: SpellDescFragment[]): string {
  let out = "";

  for (const fragment of fragments) {
    switch (fragment.kind) {
      case "duration":
      case "text":
      case "value": {
        out += fragment.value;
        break;
      }

      case "embedded": {
        out += flatten(fragment.fragments);
        break;
      }

      case "spellName": {
        out += fragment.name;
        break;
      }

      case "unresolved": {
        out += `[${fragment.token}]`;
        break;
      }

      default: {
        break;
      }
    }
  }

  return out;
}

const common = loadCommon();

function render(input: SpellRenderInput) {
  return renderSpellDescWithData(common, input);
}

const fixtureCases = [
  { fixture: fixture108359, name: "108359.json" },
  { fixture: fixture202782, name: "202782.json" },
  { fixture: fixture302500, name: "302500.json" },
  { fixture: fixture30451, name: "30451.json" },
  { fixture: fixture315341, name: "315341.json" },
  { fixture: fixture42955, name: "42955.json" },
  { fixture: fixture43265, name: "43265.json" },
  { fixture: fixture703, name: "703.json" },
] satisfies readonly {
  fixture: { input: SpellRenderInput };
  name: string;
}[];

describe("spell render e2e (real wowlab-common wasm)", () => {
  it("has fixtures to run", () => {
    expect(fixtureCases).toHaveLength(8);
  });

  for (const { fixture, name } of fixtureCases) {
    it(`renders fixture ${name} to its golden output`, () => {
      const result = render(fixture.input);

      expect(result.fragments).toEqual(fixture.expected_fragments);
      expect(flatten(result.fragments)).toBe(fixture.expected_text);
    });
  }

  // Regression: Arcane Blast rendered "dealing 0 Arcane damage" when the SP coefficient was ignored.
  it("Arcane Blast (30451) shows SP-scaled damage (not 0) and three paragraphs", () => {
    const result = render(fixture30451.input);
    const text = flatten(result.fragments);

    expect(text).not.toContain("dealing 0 Arcane");
    expect(text).toMatch(/dealing [1-9]\d*(\.\d+)? Arcane damage/);
    expect(text).toContain("reduces cast time by 8%");
    expect(text.split("\n\n")).toHaveLength(3);

    const damage = result.fragments.find(
      (f): f is Extract<SpellDescFragment, { kind: "value" }> =>
        f.kind === "value",
    );

    expect(damage?.raw).toBeGreaterThan(0);
  });

  // $?s takes the known-branch when the resolved paperdoll knows the conditional spell.
  it("Between the Eyes (315341) shows the $?s known-branch", () => {
    const known = new Set(fixture315341.input.paperdoll.known_spell_ids);

    expect(known.has(193_531)).toBe(true);

    const result = render(fixture315341.input);

    expect(flatten(result.fragments)).toContain("6 points");
  });
});
