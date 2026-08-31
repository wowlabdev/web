import { OrganizationJsonLd, SoftwareApplicationJsonLd } from "next-seo";

import { env } from "@wowlab/shared/lib/env";
import {
  GITHUB_ORGANIZATION_URL,
  landingUrl,
} from "@wowlab/shared/lib/routing";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@wowlab/shared/lib/seo";

import { LandingBentoSection } from "./landing-bento-section";
import { LandingCtaSection } from "./landing-cta-section";
import { LandingFeaturesSection } from "./landing-features-section";
import { LandingHeroSection } from "./landing-hero-section";

export function LandingPage() {
  return (
    <>
      <OrganizationJsonLd
        logo={landingUrl("/web-app-manifest-512x512.png")}
        name={SITE_NAME}
        sameAs={[GITHUB_ORGANIZATION_URL, env.DISCORD_URL]}
        url={landingUrl()}
      />
      <SoftwareApplicationJsonLd
        applicationCategory="GameApplication"
        description={DEFAULT_DESCRIPTION}
        name={SITE_NAME}
        offers={{ price: 0, priceCurrency: "USD" }}
        operatingSystem="Web"
        url={landingUrl()}
      />
      <LandingHeroSection />
      <LandingBentoSection />
      <LandingFeaturesSection />
      <LandingCtaSection />
    </>
  );
}
