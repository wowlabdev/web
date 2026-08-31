"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { useIntlayer, useLocale } from "next-intlayer";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { z } from "zod";

import { sendEmailOtp } from "@/lib/query/services";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";
import { env } from "@wowlab/shared/lib/env";

import { OtpStepForm } from "./otp-step-form";

type EmailOtpRequestStepProps = {
  onError: (message: string | null) => void;
  onSent: (email: string) => void;
};

export function EmailOtpRequestStep({
  onError,
  onSent,
}: Readonly<EmailOtpRequestStepProps>) {
  const content = useIntlayer("signIn");
  const { locale } = useLocale();
  const { resolvedTheme } = useTheme();
  const [captchaToken, setCaptchaToken] = useState<string>();
  const [captchaReady, setCaptchaReady] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const captchaTheme = resolvedTheme === "dark" ? "dark" : "light";

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      if (!captchaToken) {
        return;
      }

      const address = value.email.trim();

      onError(null);

      try {
        await sendEmailOtp(address, captchaToken);
        onSent(address);
      } catch {
        onError(content.sendError.value);
      } finally {
        // Turnstile tokens are single-use; force a fresh challenge.
        turnstileRef.current?.reset();
        setCaptchaToken(undefined);
      }
    },
    validators: {
      onChange: z.object({ email: z.string().trim().pipe(z.email()) }),
    },
  });

  return (
    <OtpStepForm onSubmit={() => void form.handleSubmit()}>
      <form.Field name="email">
        {(field) => (
          <Field
            data-invalid={
              field.state.meta.isTouched && !field.state.meta.isValid
            }
          >
            <FieldLabel htmlFor={field.name}>{content.emailLabel}</FieldLabel>
            <Input
              id={field.name}
              type="email"
              autoComplete="email"
              placeholder={content.emailPlaceholder.value}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <Field className="relative min-h-[65px]">
        <Turnstile
          ref={turnstileRef}
          siteKey={env.TURNSTILE_SITE_KEY}
          options={{
            language: locale,
            size: "flexible",
            theme: captchaTheme,
          }}
          onWidgetLoad={() => setCaptchaReady(true)}
          onSuccess={setCaptchaToken}
          onExpire={() => setCaptchaToken(undefined)}
          onError={() => setCaptchaToken(undefined)}
        />
        {captchaReady ? null : (
          <Skeleton className="absolute inset-0 rounded-md" />
        )}
      </Field>

      <Field>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button
              type="submit"
              disabled={!canSubmit || !captchaToken}
              loading={form.state.isSubmitting}
            >
              {content.sendCode}
            </Button>
          )}
        </form.Subscribe>
      </Field>
    </OtpStepForm>
  );
}
