"use client";

import { create } from "zustand";

export type AssistantIntent = "fix";

type AssistantStore = {
  isOpen: boolean;
  intent: AssistantIntent | null;
  open: (intent?: AssistantIntent) => void;
  close: () => void;
  consumeIntent: () => void;
};

export const useAssistantStore = create<AssistantStore>()((set) => ({
  close: () => set({ intent: null, isOpen: false }),
  consumeIntent: () => set({ intent: null }),
  intent: null,
  isOpen: false,
  open: (intent) => set({ intent: intent ?? null, isOpen: true }),
}));
