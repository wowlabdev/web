import { describe, expect, it } from "vitest";

import { storedDocumentToRow } from "./store";

describe("storedDocumentToRow", () => {
  it("removes a matching storage key", () => {
    expect(
      storedDocumentToRow({ id: 42, name: "Arcane Intellect", pk: "42" }, "42"),
    ).toEqual({ id: 42, name: "Arcane Intellect" });
  });

  it("supports composite storage keys", () => {
    expect(
      storedDocumentToRow(
        { enchantment_id: 7, item_id: 42, pk: "42:7" },
        "42:7",
      ),
    ).toEqual({ enchantment_id: 7, item_id: 42 });
  });

  it("rejects a row stored under the wrong key", () => {
    expect(() => storedDocumentToRow({ id: 42, pk: "24" }, "42")).toThrow(
      "Stored game row has primary key 24, expected 42",
    );
  });
});
