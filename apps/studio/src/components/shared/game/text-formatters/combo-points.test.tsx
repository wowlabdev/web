import type { SpellDescFragment } from "wowlab-common";

import { describe, expect, it } from "vitest";

import { comboPoints } from "./combo-points";

function dur(value: string, raw_ms = 0): SpellDescFragment {
  return { kind: "duration", raw_ms, value };
}

function text(value: string): SpellDescFragment {
  return { kind: "text", value };
}

function val(value: string, raw = 0): SpellDescFragment {
  return { kind: "value", raw, value };
}

const noop = () => null;
const ctx = { comboPointLabel: (num: string) => `${num} point:` };

describe("comboPoints", () => {
  it("matches multi-fragment combo point block", () => {
    const frags = [
      text("1 point: "),
      val("100"),
      text(" 2 points: "),
      val("200"),
    ];
    const result = comboPoints(frags, 0, noop, ctx);

    expect(result).not.toBeNull();
    expect(result!.consumed).toBe(4);
  });

  it("does not match non-combo text", () => {
    const frags = [text("Just some text"), val("50%")];

    expect(comboPoints(frags, 0, noop, ctx)).toBeNull();
  });

  it("does not match from wrong index", () => {
    const frags = [
      text("preamble"),
      text("1 point: 10 "),
      text("2 points: 20"),
    ];

    expect(comboPoints(frags, 0, noop, ctx)).toBeNull();
  });

  it("matches from correct index", () => {
    const frags = [
      text("preamble"),
      text("1 point: 10 "),
      text("2 points: 20"),
    ];
    const result = comboPoints(frags, 1, noop, ctx);

    expect(result).not.toBeNull();
    expect(result!.consumed).toBe(2);
  });

  it("matches a single fragment containing all combo point lines", () => {
    const frags = [
      text("1 point: 12 seconds 2 points: 18 seconds 3 points: 24 seconds"),
    ];
    const result = comboPoints(frags, 0, noop, ctx);

    expect(result).not.toBeNull();
    expect(result!.consumed).toBe(1);
  });

  it("returns null when only one combo point line exists", () => {
    const frags = [text("1 point: 100")];

    expect(comboPoints(frags, 0, noop, ctx)).toBeNull();
  });

  it("stops at non-inline fragment kinds", () => {
    const frags = [
      text("1 point: "),
      val("100"),
      { kind: "spellName", name: "Foo", spell_id: 1 } as SpellDescFragment,
      text("3 points: "),
      val("300"),
    ];
    const result = comboPoints(frags, 0, noop, ctx);

    expect(result).toBeNull();
  });

  it("matches killing spree pattern with durations", () => {
    const frags = [
      text("1 point : "),
      val("0"),
      text(" over "),
      dur("0.50sec"),
      text(" 2 points: "),
      val("0"),
      text(" over "),
      dur("1.00sec"),
    ];
    const result = comboPoints(frags, 0, noop, ctx);

    expect(result).not.toBeNull();
    expect(result!.consumed).toBe(8);
  });
});
