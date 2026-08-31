import { CreditCardIcon, MailIcon, ShieldAlertIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer/server";

import { FeatureGrid } from "@wowlab/shared/components/common/feature-grid";
import { ArticleHeader } from "@wowlab/shared/components/content/article-header";
import { ContentArticle } from "@wowlab/shared/components/content/content-article";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { env } from "@wowlab/shared/lib/env";
import { DiscordIcon, GitHubIcon } from "@wowlab/shared/lib/icons";
import { makeBillingUrl } from "@wowlab/shared/lib/links";
import { GITHUB_ORGANIZATION_URL } from "@wowlab/shared/lib/routing";

export function ContactPage() {
  const content = useIntlayer("contactPage");

  return (
    <ContentArticle>
      <ArticleHeader title={content.title} description={content.intro} />

      <div className="not-prose space-y-8">
        <FeatureGrid
          columns={2}
          featuresList={[
            {
              description: content.discordBody.value,
              href: env.DISCORD_URL,
              icon: <DiscordIcon />,
              key: "discord",
              title: content.discordTitle.value,
            },
            {
              description: content.githubBody.value,
              href: GITHUB_ORGANIZATION_URL,
              icon: <GitHubIcon />,
              key: "github",
              title: content.githubTitle.value,
            },
            {
              description: content.emailBody.value,
              href: "mailto:privacy@wowlab.gg",
              icon: <MailIcon />,
              key: "email",
              title: content.emailTitle.value,
            },
            {
              description: content.billingBody.value,
              href: makeBillingUrl(),
              icon: <CreditCardIcon />,
              key: "billing",
              title: content.billingTitle.value,
            },
          ]}
        />

        <Alert>
          <ShieldAlertIcon />
          <AlertTitle>{content.privateTitle}</AlertTitle>
          <AlertDescription>{content.privateBody}</AlertDescription>
        </Alert>
      </div>
    </ContentArticle>
  );
}
