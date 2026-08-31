import { BookOpenIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer/server";

import { appUrl, href, routes } from "@wowlab/shared/lib/routing";

import { LandingCta } from "./landing-cta";

export function LandingCtaSection() {
  const content = useIntlayer("landingPage");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <LandingCta
        buttonHref={appUrl(href(routes.simulate.index))}
        buttonLabel={content.ctaButtonLabel}
        description={content.ctaDescription}
        secondaryHref={appUrl(href(routes.dev.docs.index))}
        secondaryLabel={
          <span className="inline-flex items-center gap-2">
            <BookOpenIcon className="size-4" />
            {content.ctaSecondaryLabel}
          </span>
        }
        title={content.ctaTitle}
      />
    </div>
  );
}
