"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SHARED_STORAGE_KEYS } from "@wowlab/shared/lib/storage";

export type ConsentCategory = "preferences" | "analytics";

type Categories = Record<ConsentCategory, boolean>;

type ConsentState = {
  isDecided: boolean;
  decidedAt: number | null;
} & Categories;

type ConsentStore = {
  isSettingsOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  saveSelection: (categories: Categories) => void;
  openSettings: () => void;
  closeSettings: () => void;
} & ConsentState;

const DEFAULTS: ConsentState = {
  analytics: false,
  decidedAt: null,
  isDecided: false,
  preferences: false,
};

export const useConsentStore = create<ConsentStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      acceptAll: () =>
        set({
          analytics: true,
          decidedAt: Date.now(),
          isDecided: true,
          isSettingsOpen: false,
          preferences: true,
        }),
      closeSettings: () => set({ isSettingsOpen: false }),
      isSettingsOpen: false,
      openSettings: () => set({ isSettingsOpen: true }),
      rejectAll: () =>
        set({
          analytics: false,
          decidedAt: Date.now(),
          isDecided: true,
          isSettingsOpen: false,
          preferences: false,
        }),
      saveSelection: (categories) =>
        set({
          ...categories,
          decidedAt: Date.now(),
          isDecided: true,
          isSettingsOpen: false,
        }),
    }),
    {
      name: SHARED_STORAGE_KEYS.consent,
      partialize: (state) => ({
        analytics: state.analytics,
        decidedAt: state.decidedAt,
        isDecided: state.isDecided,
        preferences: state.preferences,
      }),
      skipHydration: true,
      version: 1,
    },
  ),
);

if (typeof window !== "undefined") {
  void useConsentStore.persist.rehydrate();
}

export function useConsentHydrated() {
  return useSyncExternalStore(
    (cb) => useConsentStore.persist.onFinishHydration(cb),
    () => useConsentStore.persist.hasHydrated(),
    () => false,
  );
}
