import type { Rotation } from "wowlab-engine";

export const MALFORMED_ROTATION_JSON = {
  actions: [],
  lists: {},
  name: "Broken",
  variables: {
    execute: {
      left: { type: "int", value: 20 },
      op: "lt",
      type: "compare",
    },
  },
  version: 1,
};

export const VALID_ROTATION_JSON = {
  actions: [
    {
      condition: {
        left: { domain: "resource", key: "mana", name: "pct", type: "read" },
        op: "gt",
        right: { type: "int", value: 20 },
        type: "compare",
      },
      spell: "fireball",
      type: "cast",
    },
  ],
  lists: {
    main: [{ seconds: 1, type: "wait" }],
  },
  name: "Fixture",
  variables: {
    burst: { type: "bool", value: true },
  },
  version: 1,
} satisfies Rotation;
