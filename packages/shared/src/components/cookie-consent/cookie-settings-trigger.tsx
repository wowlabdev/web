"use client";

import { useIntlayer } from "next-intlayer";

import { useConsentStore } from "./store";

export function CookieSettingsTrigger({
  className,
}: Readonly<{ className?: string }>) {
  const content = useIntlayer("cookieConsent");
  const openSettings = useConsentStore((s) => s.openSettings);

  return (
    <button type="button" onClick={openSettings} className={className}>
      {content.triggerLabel.value}
    </button>
  );
}
