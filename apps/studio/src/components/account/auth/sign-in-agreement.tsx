import { useIntlayer } from "next-intlayer/server";

import { landingUrl } from "@wowlab/shared/lib/routing";

export function SignInAgreement() {
  const content = useIntlayer("signIn");

  return (
    <p className="text-muted-foreground text-center text-xs">
      {content.agreement({
        privacy: (
          <a
            href={landingUrl("/privacy")}
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:underline"
          >
            {content.privacyPolicy}
          </a>
        ),
        terms: (
          <a
            href={landingUrl("/terms")}
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:underline"
          >
            {content.termsOfService}
          </a>
        ),
      })}
    </p>
  );
}
