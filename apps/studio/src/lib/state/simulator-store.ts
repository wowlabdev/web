import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/storage/keys";

const MIN_ITERATIONS = 1000;
const MAX_ITERATIONS = 1_000_000;

export type SimulatorState = {
  iterations: number;
  rotationId: string | null;
  settingOverrides: Record<string, PersistedSettingValue>;
  simcInput: string;
  specId: number | null;
};

type PersistedSettingValue = boolean | number | string;

type SimulatorActions = {
  clearSettingOverrides: () => void;
  resetSettingOverride: (key: string) => void;
  setIterations: (value: number) => void;
  setRotationId: (rotationId: string | null) => void;
  setSettingOverride: (key: string, value: PersistedSettingValue) => void;
  setSimcInput: (value: string) => void;
  setSpecId: (specId: number | null) => void;
};

const INITIAL_STATE: SimulatorState = {
  iterations: 10_000,
  rotationId: null,
  settingOverrides: {},
  simcInput: "",
  specId: null,
};

function clampIterations(value: number): number {
  return Math.min(MAX_ITERATIONS, Math.max(MIN_ITERATIONS, value));
}

export const useSimulatorStore = create<SimulatorActions & SimulatorState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      clearSettingOverrides: () => set({ settingOverrides: {} }),
      resetSettingOverride: (key) =>
        set((s) => {
          const settingOverrides = { ...s.settingOverrides };

          delete settingOverrides[key];

          return { settingOverrides };
        }),
      setIterations: (value) =>
        set({
          iterations: Number.isFinite(value)
            ? clampIterations(value)
            : INITIAL_STATE.iterations,
        }),
      setRotationId: (rotationId) => set({ rotationId }),
      setSettingOverride: (key, value) =>
        set((s) => ({
          settingOverrides: { ...s.settingOverrides, [key]: value },
        })),
      setSimcInput: (value) => set({ simcInput: value }),
      setSpecId: (specId) => set({ specId }),
    }),
    {
      name: STORAGE_KEYS.simulator,
      partialize: (s) => ({
        iterations: s.iterations,
        rotationId: s.rotationId,
        settingOverrides: s.settingOverrides,
        simcInput: s.simcInput,
        specId: s.specId,
      }),
      version: 2,
    },
  ),
);
