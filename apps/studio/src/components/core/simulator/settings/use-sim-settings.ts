"use client";

import { useMemoizedFn } from "ahooks";
import { useMemo } from "react";

import { useEngine } from "@/components/shared/wasm";
import { useSimulatorStore } from "@/lib/state";

import {
  getDefaultValue,
  isOverridden,
  type SettingGroup,
  type SettingValue,
  type WasmSettingDef,
} from "./setting-types";

type UseSimSettingsResult = {
  groupedSettings: SettingGroup[];
  overrides: Record<string, SettingValue>;
  resetAll: () => void;
  resetSetting: (key: string) => void;
  setSetting: (key: string, value: SettingValue) => void;
  settings: Record<string, SettingValue>;
};

export function useSimSettings(): UseSimSettingsResult {
  const engine = useEngine();
  const settingOverrides = useSimulatorStore((s) => s.settingOverrides);
  const setSettingOverride = useSimulatorStore((s) => s.setSettingOverride);
  const resetSettingOverride = useSimulatorStore((s) => s.resetSettingOverride);
  const clearSettingOverrides = useSimulatorStore(
    (s) => s.clearSettingOverrides,
  );

  const availableSettings = useMemo(() => {
    const fn = (engine as Record<string, unknown>).getAvailableSettings;

    if (typeof fn === "function") {
      return fn() as WasmSettingDef[];
    }

    return [] as WasmSettingDef[];
  }, [engine]);

  const defaultSettings = useMemo(() => {
    const entries = availableSettings.map((setting) => [
      setting.key,
      getDefaultValue(setting.kind),
    ]);

    return Object.fromEntries(entries) as Record<string, SettingValue>;
  }, [availableSettings]);

  const settings = useMemo(() => {
    const nextSettings: Record<string, SettingValue> = { ...defaultSettings };

    for (const setting of availableSettings) {
      if (!Object.hasOwn(settingOverrides, setting.key)) {
        continue;
      }

      const override = settingOverrides[setting.key];

      if (isSameValueType(setting, override)) {
        nextSettings[setting.key] = override;
      }
    }

    return nextSettings;
  }, [availableSettings, defaultSettings, settingOverrides]);

  const groupedSettings = useMemo(() => {
    const groups = new Map<string, Map<string, WasmSettingDef[]>>();

    for (const setting of availableSettings) {
      const groupName = setting.group;
      const sectionName = setting.section;
      const sectionMap = groups.get(groupName) ?? new Map();
      const sectionItems = sectionMap.get(sectionName) ?? [];

      sectionItems.push(setting);
      sectionMap.set(sectionName, sectionItems);
      groups.set(groupName, sectionMap);
    }

    return [...groups.entries()].map(([group, sections]) => ({
      group,
      sections: [...sections.entries()].map(([section, items]) => ({
        items,
        section,
      })),
    }));
  }, [availableSettings]);

  const overrides = useMemo(() => {
    const result: Record<string, SettingValue> = {};

    for (const setting of availableSettings) {
      const currentValue = settings[setting.key];

      if (isOverridden(setting, currentValue)) {
        result[setting.key] = currentValue;
      }
    }

    return result;
  }, [availableSettings, settings]);

  const setSetting = useMemoizedFn((key: string, value: SettingValue) => {
    const setting = availableSettings.find((s) => s.key === key);

    if (!setting) {
      return;
    }

    if (value === getDefaultValue(setting.kind)) {
      resetSettingOverride(key);

      return;
    }

    setSettingOverride(key, value);
  });

  const resetSetting = useMemoizedFn((key: string) => {
    resetSettingOverride(key);
  });

  const resetAll = useMemoizedFn(() => {
    clearSettingOverrides();
  });

  return {
    groupedSettings,
    overrides,
    resetAll,
    resetSetting,
    setSetting,
    settings,
  };
}

function isSameValueType(
  setting: WasmSettingDef,
  value: boolean | number | string,
): value is SettingValue {
  return typeof value === typeof getDefaultValue(setting.kind);
}
