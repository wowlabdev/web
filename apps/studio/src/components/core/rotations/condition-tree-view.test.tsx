import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Condition } from "./rotation-view-types";

import { ConditionTreeView } from "./condition-tree-view";

vi.mock("next-intlayer", () => ({
  useIntlayer: () => ({
    conditionLogicalAnd: "AND",
    conditionLogicalOr: "OR",
    operatorAbs: { value: "abs" },
    operatorCeil: { value: "ceil" },
    operatorFloor: { value: "floor" },
    operatorMax: { value: "max" },
    operatorMin: { value: "min" },
  }),
}));

describe("ConditionTreeView", () => {
  it("renders true when an OR operand short-circuits the expression", () => {
    const condition = {
      operands: [
        { type: "int", value: 7 },
        { type: "bool", value: true },
      ],
      type: "or",
    } satisfies Condition;

    const { container } = render(
      <ConditionTreeView condition={condition} specMap={null} />,
    );

    expect(container.textContent).toBe("true");
  });

  it("renders duplicate operands without duplicate React keys", () => {
    const condition = {
      operands: [
        { type: "int", value: 7 },
        { type: "int", value: 7 },
      ],
      type: "or",
    } satisfies Condition;

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { container } = render(
      <ConditionTreeView condition={condition} specMap={null} />,
    );

    consoleError.mockRestore();
    expect(container.textContent).toBe("7OR7");
    expect(consoleError).not.toHaveBeenCalled();
  });
});
