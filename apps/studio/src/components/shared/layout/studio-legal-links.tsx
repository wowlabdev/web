"use client";

import { useIntlayer } from "next-intlayer";

import {
  makePrivacyPolicyUrl,
  makeRefundPolicyUrl,
  makeTermsUrl,
} from "@wowlab/shared/lib/links";

export function StudioLegalLinks() {
  const content = useIntlayer("dashboardLayout");

  return (
    <nav
      aria-label={content.legalLinks.value}
      className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs"
    >
      <a
        className="hover:text-foreground transition-colors"
        href={makeTermsUrl()}
        rel="noreferrer"
        target="_blank"
      >
        {content.terms}
      </a>
      <a
        className="hover:text-foreground transition-colors"
        href={makePrivacyPolicyUrl()}
        rel="noreferrer"
        target="_blank"
      >
        {content.privacy}
      </a>
      <a
        className="hover:text-foreground transition-colors"
        href={makeRefundPolicyUrl()}
        rel="noreferrer"
        target="_blank"
      >
        {content.refunds}
      </a>
    </nav>
  );
}
