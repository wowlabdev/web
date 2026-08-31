import type { SpellDescFragment } from "wowlab-common";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FragmentRenderer } from "./fragment-renderer";

vi.mock("./game-icon", () => ({
  GameIcon: ({ iconName }: { iconName: string }) => (
    <span data-testid="icon">{iconName}</span>
  ),
}));

vi.mock("@wowlab/shared/components/ui/separator", () => ({
  Separator: ({ className }: { className?: string }) => (
    <hr data-testid="separator" className={className} />
  ),
}));

vi.mock("next-intlayer", () => ({
  useIntlayer: () => ({
    comboPointLabel: (count: number) =>
      `${count} ${count === 1 ? "point" : "points"}:`,
  }),
}));

function dur(value: string, raw_ms = 0): SpellDescFragment {
  return { kind: "duration", raw_ms, value };
}

function text(value: string): SpellDescFragment {
  return { kind: "text", value };
}

function val(value: string, raw = 0): SpellDescFragment {
  return { kind: "value", raw, value };
}

describe("FragmentRenderer", () => {
  it("renders plain text", () => {
    const { container } = render(
      <FragmentRenderer fragments={[text("Hello world")]} />,
    );

    expect(container.textContent).toBe("Hello world");
  });

  it("renders value fragments with highlight", () => {
    const { container } = render(<FragmentRenderer fragments={[val("50%")]} />);
    const span = container.querySelector(".text-amber-400");

    expect(span?.textContent).toBe("50%");
  });

  it("renders duration fragments with highlight", () => {
    const { container } = render(
      <FragmentRenderer fragments={[dur("12 seconds")]} />,
    );
    const span = container.querySelector(".text-amber-400");

    expect(span?.textContent).toBe("12 seconds");
  });

  it("renders color spans", () => {
    const fragments: SpellDescFragment[] = [
      { color: "ffff8000", kind: "colorStart" },
      text("orange text"),
      { kind: "colorEnd" },
    ];
    const { container } = render(<FragmentRenderer fragments={fragments} />);

    expect(container.textContent).toBe("orange text");
    const colored = container.querySelector("[style]") as HTMLElement;

    expect(colored.style.color).toBe("rgb(255, 128, 0)");
  });

  it("renders spell names", () => {
    const { container } = render(
      <FragmentRenderer
        fragments={[{ kind: "spellName", name: "Fireball", spell_id: 123 }]}
      />,
    );
    const span = container.querySelector(".text-amber-300");

    expect(span?.textContent).toBe("Fireball");
  });

  it("renders unresolved tokens", () => {
    const { container } = render(
      <FragmentRenderer
        fragments={[{ kind: "unresolved", token: "$unknown" }]}
      />,
    );

    expect(container.textContent).toBe("$unknown");
  });
});

describe("combo points formatter", () => {
  it("renders Slice and Dice style (all text fragments)", () => {
    const fragments: SpellDescFragment[] = [
      text("Lasts longer per combo point. "),
      text("1 point: 12 seconds "),
      text("2 points: 18 seconds "),
      text("3 points: 24 seconds "),
      text("4 points: 30 seconds "),
      text("5 points: 36 seconds"),
    ];

    const { container } = render(<FragmentRenderer fragments={fragments} />);

    expect(container.textContent).toContain("1 point:");
    expect(container.textContent).toContain("12 seconds");
    expect(container.textContent).toContain("5 points:");
    expect(container.textContent).toContain("36 seconds");

    const separator = container.querySelector("[data-testid='separator']");

    expect(separator).not.toBeNull();
  });

  it("renders Killing Spree style (mixed text + value/duration fragments)", () => {
    const fragments: SpellDescFragment[] = [
      text("Damage per combo point. "),
      text("1 point : "),
      val("100"),
      text(" over "),
      dur("0.50 sec"),
      text(" 2 points: "),
      val("200"),
      text(" over "),
      dur("1.00 sec"),
      text(" 3 points: "),
      val("300"),
      text(" over "),
      dur("1.50 sec"),
    ];

    const { container } = render(<FragmentRenderer fragments={fragments} />);

    expect(container.textContent).toContain("1 point:");
    expect(container.textContent).toContain("100");
    expect(container.textContent).toContain("3 points:");
    expect(container.textContent).toContain("300");
    expect(container.textContent).toContain("1.50 sec");

    const values = container.querySelectorAll(".text-amber-400");

    expect(values.length).toBeGreaterThanOrEqual(3);
  });

  it("does not match fragments without combo point pattern", () => {
    const fragments: SpellDescFragment[] = [
      text("Just a normal spell description."),
      val("50%"),
      text(" more damage."),
    ];

    const { container } = render(<FragmentRenderer fragments={fragments} />);

    const separator = container.querySelector("[data-testid='separator']");

    expect(separator).toBeNull();
    expect(container.textContent).toContain("50%");
    expect(container.textContent).toContain("more damage.");
  });

  it("keeps preamble text before combo point block (separate fragments)", () => {
    const fragments: SpellDescFragment[] = [
      text("Some preamble. "),
      text("1 point: 10 "),
      text("2 points: 20"),
    ];

    const { container } = render(<FragmentRenderer fragments={fragments} />);

    expect(container.textContent).toContain("Some preamble.");
    expect(container.textContent).toContain("1 point:");
    expect(container.textContent).toContain("2 points:");
  });

  it("keeps preamble in single fragment with combo points", () => {
    const fragments: SpellDescFragment[] = [
      text(
        "Finishing move that deals damage. 1 point: 100 2 points: 200 3 points: 300",
      ),
    ];

    const { container } = render(<FragmentRenderer fragments={fragments} />);

    expect(container.textContent).toContain(
      "Finishing move that deals damage.",
    );
    expect(container.textContent).toContain("1 point:");
    expect(container.textContent).toContain("3 points:");
    expect(container.textContent).toContain("300");
  });

  it("renders single text fragment with all combo point lines", () => {
    const fragments: SpellDescFragment[] = [
      text(
        "1 point: 12 seconds 2 points: 18 seconds 3 points: 24 seconds 4 points: 30 seconds 5 points: 36 seconds",
      ),
    ];

    const { container } = render(<FragmentRenderer fragments={fragments} />);

    expect(container.textContent).toContain("1 point:");
    expect(container.textContent).toContain("12 seconds");
    expect(container.textContent).toContain("5 points:");
    expect(container.textContent).toContain("36 seconds");

    const labels = container.querySelectorAll(".tabular-nums");

    expect(labels).toHaveLength(5);
  });

  it("renders consistent label width for alignment", () => {
    const fragments: SpellDescFragment[] = [
      text("1 point: 10 "),
      text("2 points: 20"),
    ];

    const { container } = render(<FragmentRenderer fragments={fragments} />);

    const labels = container.querySelectorAll(".tabular-nums");

    expect(labels).toHaveLength(2);

    for (const label of labels) {
      expect(label.classList.contains("w-14")).toBe(true);
    }
  });
});
