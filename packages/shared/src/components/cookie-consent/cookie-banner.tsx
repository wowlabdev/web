"use client";

import { CookieIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, landingUrl, routes } from "@wowlab/shared/lib/routing";

import { useConsentHydrated, useConsentStore } from "./store";

export function CookieBanner() {
  const content = useIntlayer("cookieConsent");
  const hydrated = useConsentHydrated();
  const isDecided = useConsentStore((s) => s.isDecided);
  const acceptAll = useConsentStore((s) => s.acceptAll);
  const rejectAll = useConsentStore((s) => s.rejectAll);
  const openSettings = useConsentStore((s) => s.openSettings);

  if (!hydrated || isDecided) {
    return null;
  }

  return (
    <Card
      id="cookie_alert"
      className="cookie-alert cookie-banner fixed z-50 border-2 shadow-lg max-md:top-1/2 max-md:-translate-y-1/2 max-sm:mx-4 sm:max-md:left-1/2 sm:max-md:-translate-x-1/2 md:right-6 md:bottom-6 md:max-w-xl"
    >
      <CardContent className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-xl font-medium">
          <CookieIcon className="size-5 shrink-0" aria-hidden />
          {content.bannerHeading.value}
        </h2>
        <p className="text-muted-foreground text-sm">
          {content.bannerBody.value} {content.bannerPrivacyPrefix.value}{" "}
          <Link
            href={landingUrl(href(routes.about.privacy))}
            className="text-primary underline-offset-4 hover:underline"
          >
            {content.bannerPrivacyLink.value}
          </Link>
          {content.bannerPrivacySuffix.value}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={acceptAll}>{content.bannerAllowAll.value}</Button>
          <Button onClick={rejectAll}>{content.bannerRejectAll.value}</Button>
          <Button variant="outline" onClick={openSettings}>
            {content.bannerManage.value}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
