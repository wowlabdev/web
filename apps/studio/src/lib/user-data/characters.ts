import type { Profile } from "wowlab-common";

import { kebabCase } from "change-case";

import type { CharacterSnapshotDoc, SavedCharacterDoc } from "./store";

import { getUserDb } from "./store";

export type CharacterSnapshot = CharacterSnapshotDoc;
export type SavedCharacter = SavedCharacterDoc;

const MAX_SNAPSHOTS = 10;

export type UpsertCharacterInput = {
  profile: Profile;
  rawSimc: string;
  specId: number;
};

export function characterIdentity(profile: Profile, specId: number): string {
  const name = kebabCase(profile.character.name);
  const region = profile.character.region
    ? kebabCase(profile.character.region)
    : "";
  const realm = profile.character.server
    ? kebabCase(profile.character.server)
    : "";

  if (region && realm) {
    return `${region}-${realm}-${name}`;
  }

  return `spec-${specId}-${name}`;
}

export async function deleteSavedCharacter(id: string): Promise<void> {
  const db = await getUserDb();
  const existing = await db.characters.findOne(id).exec();

  await existing?.remove();
}

export async function touchSavedCharacter(id: string): Promise<void> {
  const db = await getUserDb();
  const existing = await db.characters.findOne(id).exec();

  if (existing) {
    await existing.patch({ lastUsedAt: Date.now() });
  }
}

export async function upsertSavedCharacter(
  input: UpsertCharacterInput,
): Promise<SavedCharacter> {
  const { profile, rawSimc, specId } = input;
  const db = await getUserDb();
  const id = characterIdentity(profile, specId);
  const now = Date.now();
  const trimmed = rawSimc.trim();

  const existing = await db.characters.findOne(id).exec();

  if (!existing) {
    const doc: SavedCharacterDoc = {
      createdAt: now,
      id,
      lastUsedAt: now,
      name: profile.character.name,
      snapshots: [{ importedAt: now, simc: trimmed }],
      specId,
      updatedAt: now,
    };

    await db.characters.insert(doc);

    return doc;
  }

  const current = existing.toJSON() as SavedCharacterDoc;
  const newestSimc = current.snapshots.at(0)?.simc.trim();

  if (newestSimc === trimmed) {
    const patch = { lastUsedAt: now, updatedAt: now };

    await existing.patch(patch);

    return { ...current, ...patch };
  }

  const snapshots: CharacterSnapshotDoc[] = [
    { importedAt: now, simc: trimmed },
    ...current.snapshots,
  ].slice(0, MAX_SNAPSHOTS);

  const patch = {
    lastUsedAt: now,
    name: profile.character.name,
    snapshots,
    specId,
    updatedAt: now,
  };

  await existing.patch(patch);

  return { ...current, ...patch };
}
