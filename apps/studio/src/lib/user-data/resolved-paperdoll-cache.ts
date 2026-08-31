import type { ResolvedPaperdoll } from "wowlab-common";

import { getUserDb } from "./store";

export function paperdollCacheKey(
  profileCacheKey: string,
  specId: number,
): string {
  return `${specId}:${profileCacheKey}`;
}

export async function readCachedPaperdoll(
  key: string,
  revision: number,
): Promise<ResolvedPaperdoll | null> {
  const col = (await getUserDb()).collections.resolvedPaperdolls;
  const doc = await col.findOne(key).exec();

  if (!doc || doc.revision !== revision) {
    return null;
  }

  return doc.paperdoll as ResolvedPaperdoll;
}

export async function writeCachedPaperdoll(
  key: string,
  revision: number,
  paperdoll: ResolvedPaperdoll,
): Promise<void> {
  await (
    await getUserDb()
  ).collections.resolvedPaperdolls.upsert({
    key,
    paperdoll,
    resolvedAt: Date.now(),
    revision,
  });
}
