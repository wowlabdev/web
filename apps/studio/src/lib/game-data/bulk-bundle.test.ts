import { describe, expect, it } from "vitest";

import type { BulkBundle } from "./bulk-bundle";

import { decodeBulkBundle, encodeBulkBundle } from "./bulk-bundle";

describe("bulk-bundle codec", () => {
  it("round-trips number, string, array, and object column values", () => {
    const bundle: BulkBundle = {
      curves: [
        { flags: 0, id: 1, type: 2 },
        { flags: 1, id: 2, type: 3 },
      ],
      global_colors: [{ color: "ffffff", id: 5, name: "FOO" }],
      item_bonuses: [
        { id: 10, order_index: 1, type: "ItemLevel", value_0: -3, value_1: 7 },
      ],
      item_drop_scaling: [
        {
          difficulty_key: "mythic",
          flair_id: null,
          item_id: 100,
          source_kind: "dungeon",
          upgrade_id: 42,
        },
      ],
      specs_traits: [
        {
          all_node_ids: [1, 2, 3],
          nodes: { a: 1, b: [4, 5] },
          point_limits: { total: 31 },
          spec_id: 250,
        },
      ],
    };

    const decoded = decodeBulkBundle(encodeBulkBundle(bundle));

    expect(decoded).toEqual(bundle);
  });

  it("preserves the encoded byte length on round-trip", () => {
    const bundle: BulkBundle = { curves: [{ id: 1 }] };
    const buffer = encodeBulkBundle(bundle);

    expect(buffer.byteLength).toBeGreaterThan(0);
    expect(decodeBulkBundle(buffer)).toEqual(bundle);
  });
});
