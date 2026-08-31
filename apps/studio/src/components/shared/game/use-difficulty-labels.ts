"use client";

import { useIntlayer } from "next-intlayer";

type DifficultyLabelKey =
  | "all"
  | "Heroic"
  | "heroic"
  | "LFR"
  | "lfr"
  | "Mythic"
  | "mythic"
  | "Mythic+"
  | "Normal"
  | "normal";

export function useDifficultyLabels(): Record<DifficultyLabelKey, string> {
  const journal = useIntlayer("journalPage");
  const game = useIntlayer("sharedGame");

  return {
    all: journal.difficultyAll.value,
    Heroic: game.difficultyHeroic.value,
    heroic: game.difficultyHeroic.value,
    LFR: game.difficultyLfr.value,
    lfr: game.difficultyLfr.value,
    Mythic: game.difficultyMythic.value,
    mythic: game.difficultyMythic.value,
    "Mythic+": game.difficultyMythicPlus.value,
    Normal: game.difficultyNormal.value,
    normal: game.difficultyNormal.value,
  };
}
