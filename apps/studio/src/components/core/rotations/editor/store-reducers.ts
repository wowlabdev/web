import type { EditorScript, RotationMetadata } from "./store-types";

import { EMPTY_METADATA } from "./store-helpers";
import { type ActionEntry, type Rotation, stripActionIds } from "./types";

export function buildInitMetadata(
  rotation: Rotation,
  incoming: Partial<RotationMetadata>,
): RotationMetadata {
  return {
    description: incoming.description ?? EMPTY_METADATA.description,
    forkedFromId: incoming.forkedFromId ?? EMPTY_METADATA.forkedFromId,
    isPublic: incoming.isPublic ?? EMPTY_METADATA.isPublic,
    name: incoming.name ?? rotation.name,
    ownerId: incoming.ownerId ?? EMPTY_METADATA.ownerId,
    rotationId: incoming.rotationId ?? EMPTY_METADATA.rotationId,
    slug: incoming.slug ?? EMPTY_METADATA.slug,
    specId: incoming.specId ?? EMPTY_METADATA.specId,
    tags: incoming.tags ?? [...EMPTY_METADATA.tags],
  };
}

// docref:start rotation-editor-dehydrate-script
export function dehydrateScript(script: EditorScript): Rotation {
  return {
    ...script,
    actions: stripActionIds(script.actions),
    lists: Object.fromEntries(
      Object.entries(script.lists).map(([name, actions]) => [
        name,
        stripActionIds(actions),
      ]),
    ),
  };
}
// docref:end rotation-editor-dehydrate-script

export function saveActionToList(
  list: ActionEntry[],
  action: ActionEntry,
): ActionEntry[] {
  const idx = list.findIndex((a) => a.id === action.id);

  return idx === -1
    ? [...list, action]
    : list.map((a, i) => (i === idx ? action : a));
}

export function toggleActionAt(
  list: ActionEntry[],
  actionIndex: number,
): ActionEntry[] {
  return list.map((entry, i) =>
    i === actionIndex ? { ...entry, enabled: entry.enabled === false } : entry,
  );
}
