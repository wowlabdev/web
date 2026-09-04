import { useIntlayer } from "next-intlayer/server";

import { makePrivacyPolicyUrl, makeTermsUrl } from "@wowlab/shared/lib/links";

export function SignInAgreement() {
  const content = useIntlayer("signIn");

  return (
    <p className="text-muted-foreground text-center text-xs">
      {content.agreement({
        privacy: (
          <a
            href={makePrivacyPolicyUrl()}
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:underline"
          >
            {content.privacyPolicy}
          </a>
        ),
        terms: (
          <a
            href={makeTermsUrl()}
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
