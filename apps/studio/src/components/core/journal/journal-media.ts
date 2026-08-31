import { makeEncounterImageUrl } from "@wowlab/shared/lib/links";

import type { JournalEncounter, JournalSource } from "./types";

type JournalMedia = {
  encounterImageUrl: null | string;
  instanceBackgroundUrl: null | string;
};

export function getJournalMedia(
  source: JournalSource | undefined,
  encounter: JournalEncounter | undefined,
): JournalMedia {
  return {
    encounterImageUrl: publicJournalMediaUrl(encounter?.imageStoragePath ?? ""),
    instanceBackgroundUrl: publicJournalMediaUrl(
      source ? instanceMediaPath(source) : "",
    ),
  };
}

export function instanceMediaPath(source: JournalSource) {
  return (
    source.loadscreenSeoStoragePath ||
    source.loadscreenStoragePath ||
    source.backgroundStoragePath ||
    source.buttonStoragePath ||
    source.loreStoragePath
  );
}

export function publicJournalMediaUrl(storagePath: string) {
  if (!storagePath) {
    return null;
  }

  return makeEncounterImageUrl(storagePath);
}
