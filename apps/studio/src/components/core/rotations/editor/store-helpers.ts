import type { Action } from "wowlab-engine";

import type { EditorScript, RotationMetadata } from "./store-types";

import { addActionIds, type Rotation } from "./types";

export const EMPTY_METADATA: RotationMetadata = {
  description: "",
  forkedFromId: null,
  isPublic: false,
  name: "",
  ownerId: null,
  rotationId: null,
  slug: "",
  specId: null,
  tags: [],
};

export function hydrate(rotation: Rotation): EditorScript {
  const lists = rotation.lists as Record<string, Action[]>;

  return {
    ...rotation,
    actions: addActionIds(rotation.actions),
    lists: Object.fromEntries(
      Object.entries(lists).map(([name, actions]) => [
        name,
        addActionIds(actions),
      ]),
    ),
  };
}
