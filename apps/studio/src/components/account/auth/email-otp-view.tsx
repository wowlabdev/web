"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert, AlertDescription } from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";

import { EmailOtpRequestStep } from "./email-otp-request-step";
import { EmailOtpVerifyStep } from "./email-otp-verify-step";

type EmailOtpViewProps = {
  onBack: () => void;
  redirectTo: string | undefined;
};

export function EmailOtpView({
  onBack,
  redirectTo,
}: Readonly<EmailOtpViewProps>) {
  const content = useIntlayer("signIn");
  const router = useRouter();
  const [step, setStep] = useState<"code" | "email">("email");
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label={content.back.value}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <p className="text-sm font-medium">{content.emailTitle}</p>
      </div>

      <p className="text-muted-foreground text-sm">
        {content.emailRecommendation}
      </p>

      {serverError ? (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      {step === "email" ? (
        <EmailOtpRequestStep
          onError={setServerError}
          onSent={(address) => {
            setEmail(address);
            setStep("code");
          }}
        />
      ) : (
        <EmailOtpVerifyStep
          email={email}
          onError={setServerError}
          onChangeEmail={() => {
            setServerError(null);
            setStep("email");
          }}
          onVerified={() => {
            router.push(redirectTo ?? "/");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
