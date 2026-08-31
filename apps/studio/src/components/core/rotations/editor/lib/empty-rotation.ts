import type { Rotation } from "../types";

export function createEmptyRotation(): Rotation {
  return {
    actions: [{ list: "main", type: "call" }],
    lists: { main: [] },
    name: "",
    variables: {},
    version: 1,
  };
}
