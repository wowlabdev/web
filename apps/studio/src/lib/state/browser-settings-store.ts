import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/storage/keys";

type BrowserSettings = {
  hasSeenWelcomeTour: boolean;
};

type BrowserSettingsActions = {
  markWelcomeTourSeen: () => void;
};

export const useBrowserSettings = create<
  BrowserSettings & BrowserSettingsActions
>()(
  persist(
    (set) => ({
      hasSeenWelcomeTour: false,
      markWelcomeTourSeen: () => set({ hasSeenWelcomeTour: true }),
    }),
    {
      name: STORAGE_KEYS.browserSettings,
      partialize: (s) => ({ hasSeenWelcomeTour: s.hasSeenWelcomeTour }),
      version: 1,
    },
  ),
);
