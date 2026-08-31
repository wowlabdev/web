"use client";

import { usePrevious, useUpdateEffect } from "ahooks";
import Script from "next/script";

import { env } from "@wowlab/shared/lib/env";

import { useConsentHydrated, useConsentStore } from "./store";

const BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

export function CloudflareAnalytics() {
  const hydrated = useConsentHydrated();
  const analytics = useConsentStore((s) => s.analytics);
  const previous = usePrevious(analytics);

  useUpdateEffect(() => {
    if (previous === true && analytics === false) {
      window.location.reload();
    }
  }, [analytics]);

  if (!hydrated || !analytics) {
    return null;
  }

  return (
    <Script
      id="cf-beacon"
      src={BEACON_SRC}
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token: env.CF_BEACON_TOKEN })}
    />
  );
}
