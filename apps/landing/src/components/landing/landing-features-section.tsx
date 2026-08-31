import { useIntlayer } from "next-intlayer/server";

import { env } from "@wowlab/shared/lib/env";
import {
  appUrl,
  GITHUB_ORGANIZATION_URL,
  href,
  routes,
} from "@wowlab/shared/lib/routing";

import { LandingAddonPreview } from "./landing-addon-preview";
import { LandingFeatures } from "./landing-features";
import { LandingPreviewIframe } from "./landing-preview-iframe";

export function LandingFeaturesSection() {
  const addon = useIntlayer("addonPage");
  const content = useIntlayer("landingPage");

  return (
    <LandingFeatures
      sections={[
        {
          badge: content.featuresBrowserBadge,
          description: content.featuresBrowserDescription,
          features: [
            {
              description: content.featuresBrowserInstantDescription,
              id: "instant",
              title: content.featuresBrowserInstantTitle,
            },
            {
              description: content.featuresBrowserPrivateDescription,
              id: "private",
              title: content.featuresBrowserPrivateTitle,
            },
            {
              description: content.featuresBrowserNonBlockingDescription,
              id: "non-blocking",
              title: content.featuresBrowserNonBlockingTitle,
            },
          ],
          id: "browser",
          media: (
            <LandingPreviewIframe
              contentHeight={1000}
              src={`${env.APP_URL}/preview/studio-home`}
              title={content.previewStudioHomeTitle.value}
            />
          ),
          title: content.featuresBrowserTitle,
        },
        {
          badge: content.featuresGuildBadge,
          description: content.featuresGuildDescription,
          features: [
            {
              description: content.featuresGuildInstantDescription,
              id: "instant",
              title: content.featuresGuildInstantTitle,
            },
            {
              description: content.featuresGuildRosterDescription,
              id: "roster",
              title: content.featuresGuildRosterTitle,
            },
            {
              description: content.featuresGuildAuditableDescription,
              id: "auditable",
              title: content.featuresGuildAuditableTitle,
            },
          ],
          id: "guild",
          media: (
            <LandingPreviewIframe
              contentHeight={800}
              src={`${env.APP_URL}/preview/drop-ranking`}
              title={content.previewDropRankingTitle.value}
            />
          ),
          title: content.featuresGuildTitle,
        },
        {
          badge: addon.badge,
          description: addon.description,
          features: [
            {
              description: addon.lootRollDescription,
              id: "loot-roll",
              title: addon.lootRollTitle,
            },
            {
              description: addon.equipDescription,
              id: "equip",
              title: addon.equipTitle,
            },
            {
              description: addon.exportDescription,
              id: "export",
              title: addon.exportTitle,
            },
          ],
          id: "addon",
          media: <LandingAddonPreview />,
          title: addon.heading,
        },
        {
          badge: content.featuresOssBadge,
          description: content.featuresOssDescription,
          features: [
            {
              description: content.featuresOssNothingHiddenDescription,
              href: appUrl(href(routes.dev.bible.index)),
              id: "nothing-hidden",
              title: content.featuresOssNothingHiddenTitle,
            },
            {
              description: content.featuresOssContributeDescription,
              href: GITHUB_ORGANIZATION_URL,
              id: "contribute",
              title: content.featuresOssContributeTitle,
            },
            {
              description: content.featuresOssTelemetryDescription,
              id: "telemetry",
              title: content.featuresOssTelemetryTitle,
            },
          ],
          id: "source-available",
          title: content.featuresOssTitle,
        },
      ]}
    />
  );
}
