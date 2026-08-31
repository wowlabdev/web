"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import type { GameSyncStep } from "@/lib/game-data/sync";

export function useGameSyncStepLabels(): Record<GameSyncStep, ReactNode> {
  const content = useIntlayer("dashboardLayout");

  return {
    download: content.gameDataStepDownload,
    insert: content.gameDataStepInsert,
    unzip: content.gameDataStepUnzip,
  };
}
