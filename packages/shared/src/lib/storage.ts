export const SHARED_STORAGE_KEYS = {
  consent: "wowlab_consent",
  // Must match next-themes' storageKey (its default is "theme").
  theme: "theme",
} as const;

export function clearThemePreference(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(SHARED_STORAGE_KEYS.theme);
  } catch {
    // localStorage can throw in privacy modes; ignore
  }
}
