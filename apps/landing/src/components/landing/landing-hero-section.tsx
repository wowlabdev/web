import { useIntlayer } from "next-intlayer/server";

import { appUrl, href, routes } from "@wowlab/shared/lib/routing";

import { LandingHero } from "./landing-hero";

export function LandingHeroSection() {
  const content = useIntlayer("landingPage");

  return (
    <LandingHero
      demoLabel={content.heroDemoLabel}
      description={content.heroDescription}
      primaryHref={appUrl(href(routes.simulate.index))}
      primaryLabel={content.heroPrimaryLabel}
      secondaryHref={href(routes.pricing)}
      secondaryLabel={content.heroSecondaryLabel}
      title={
        <>
          {content.heroTitleLead}
          <span className="relative z-10 text-primary">
            {content.heroTitleHighlight}
          </span>
        </>
      }
    />
  );
}
