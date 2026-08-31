"use client";

import { CloudflareAnalytics } from "./cloudflare-analytics";
import { CookieBanner } from "./cookie-banner";
import { CookieSettingsDialog } from "./cookie-settings-dialog";
import { PreferencesEnforcer } from "./preferences-enforcer";

export function CookieConsentMount() {
  return (
    <>
      <CookieBanner />
      <CookieSettingsDialog />
      <PreferencesEnforcer />
      <CloudflareAnalytics />
    </>
  );
}
