"use client";

import { useIntlayer } from "next-intlayer";
import { type ReactNode, useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";

import { EmailOtpView } from "./email-otp-view";
import { SignInProviderButtons } from "./sign-in-provider-buttons";

type SignInPanelProps = {
  agreement: ReactNode;
  divider: ReactNode;
  redirectTo: string | undefined;
};

export function SignInPanel({
  agreement,
  divider,
  redirectTo,
}: Readonly<SignInPanelProps>) {
  const content = useIntlayer("signIn");
  const [view, setView] = useState<"email" | "providers">("providers");

  if (view === "email") {
    return (
      <EmailOtpView
        redirectTo={redirectTo}
        onBack={() => setView("providers")}
      />
    );
  }

  return (
    <>
      <SignInProviderButtons redirectTo={redirectTo} />
      <div className="mt-3 flex justify-center">
        <Button
          variant="link"
          className="text-muted-foreground h-auto text-xs"
          onClick={() => setView("email")}
        >
          {content.emailFallbackTrigger}
        </Button>
      </div>
      {divider}
      {agreement}
    </>
  );
}
