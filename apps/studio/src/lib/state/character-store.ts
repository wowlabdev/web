import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/storage/keys";

export type CharacterState = {
  activeCharacterId: string | null;
  frozenCharacterId: string | null;
};

type CharacterActions = {
  clearActive: () => void;
  freeze: (id: string) => void;
  handleDeleted: (id: string) => void;
  setActive: (id: string) => void;
  unfreeze: () => void;
};

const INITIAL_STATE: CharacterState = {
  activeCharacterId: null,
  frozenCharacterId: null,
};

export const useCharacterStore = create<CharacterActions & CharacterState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      clearActive: () => set({ activeCharacterId: null }),
      freeze: (id) => set({ frozenCharacterId: id }),
      handleDeleted: (id) =>
        set((s) => ({
          activeCharacterId:
            s.activeCharacterId === id ? null : s.activeCharacterId,
          frozenCharacterId:
            s.frozenCharacterId === id ? null : s.frozenCharacterId,
        })),
      setActive: (id) => set({ activeCharacterId: id }),
      unfreeze: () => set({ frozenCharacterId: null }),
    }),
    {
      migrate: () => INITIAL_STATE,
      name: STORAGE_KEYS.character,
      version: 2,
    },
  ),
);

// The frozen (pinned) character wins over the last-used active selection.
export function selectEffectiveActiveId(state: CharacterState): string | null {
  return state.frozenCharacterId ?? state.activeCharacterId;
}

export function useEffectiveActiveId(): string | null {
  return useCharacterStore(selectEffectiveActiveId);
}
