import { useIntlayer } from "next-intlayer/server";

import { env } from "@wowlab/shared/lib/env";
import { appUrl, href, routes } from "@wowlab/shared/lib/routing";

import { LandingBento } from "./landing-bento";
import { LandingPreviewIframe } from "./landing-preview-iframe";

export function LandingBentoSection() {
  const content = useIntlayer("landingPage");

  return (
    <LandingBento
      cells={[
        {
          cta: {
            href: appUrl(href(routes.simulate.quick)),
            label: content.bentoQuickSimCta.value,
          },
          description: content.bentoQuickSimDescription.value,
          media: (
            <LandingPreviewIframe
              contentHeight={1100}
              src={`${env.APP_URL}/preview/quick-sim`}
              title={content.previewQuickSimTitle.value}
            />
          ),
          title: content.bentoQuickSimTitle.value,
        },
        {
          cta: {
            href: appUrl(href(routes.simulate.bags)),
            label: content.bentoBibCta.value,
          },
          description: content.bentoBibDescription.value,
          media: (
            <LandingPreviewIframe
              contentHeight={1100}
              src={`${env.APP_URL}/preview/best-in-bags`}
              title={content.previewBibTitle.value}
            />
          ),
          title: content.bentoBibTitle.value,
        },
        {
          cta: {
            href: appUrl(href(routes.rotations.index)),
            label: content.bentoRotationsCta.value,
          },
          description: content.bentoRotationsDescription.value,
          media: (
            <LandingPreviewIframe
              contentHeight={1100}
              src={`${env.APP_URL}/preview/rotations`}
              title={content.previewRotationsTitle.value}
            />
          ),
          title: content.bentoRotationsTitle.value,
        },
        {
          cta: {
            href: appUrl(href(routes.simulate.drops)),
            label: content.bentoDropOptimizerCta.value,
          },
          description: content.bentoDropOptimizerDescription.value,
          media: (
            <LandingPreviewIframe
              contentHeight={1100}
              src={`${env.APP_URL}/preview/drop-optimizer`}
              title={content.previewDropOptimizerTitle.value}
            />
          ),
          title: content.bentoDropOptimizerTitle.value,
        },
      ]}
      description={content.bentoDescription.value}
      eyebrow={content.bentoEyebrow.value}
      title={content.bentoTitle.value}
    />
  );
}
