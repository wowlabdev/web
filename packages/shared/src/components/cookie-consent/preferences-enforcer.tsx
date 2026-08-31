"use client";

import { useEventListener, useMemoizedFn } from "ahooks";
import { useEffect } from "react";

import { clearThemePreference } from "@wowlab/shared/lib/storage";

import { useConsentStore } from "./store";

export function PreferencesEnforcer() {
  const isDecided = useConsentStore((s) => s.isDecided);
  const preferences = useConsentStore((s) => s.preferences);

  const isEnforcing = isDecided && !preferences;

  const clear = useMemoizedFn(() => {
    if (!isEnforcing) {
      return;
    }

    clearThemePreference();
  });

  useEffect(() => {
    clear();
  }, [clear, isEnforcing]);

  useEventListener("pagehide", clear);

  return null;
}
