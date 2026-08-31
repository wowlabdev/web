"use client";

import { useForm } from "@tanstack/react-form";
import { useIntlayer } from "next-intlayer";
import { z } from "zod";

import { verifyEmailOtp } from "@/lib/query/services";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@wowlab/shared/components/ui/input-otp";

import { OtpStepForm } from "./otp-step-form";

const OTP_LENGTH = 8;

type EmailOtpVerifyStepProps = {
  email: string;
  onChangeEmail: () => void;
  onError: (message: string | null) => void;
  onVerified: () => void;
};

export function EmailOtpVerifyStep({
  email,
  onChangeEmail,
  onError,
  onVerified,
}: Readonly<EmailOtpVerifyStepProps>) {
  const content = useIntlayer("signIn");

  const form = useForm({
    defaultValues: { code: "" },
    onSubmit: async ({ value }) => {
      onError(null);

      try {
        await verifyEmailOtp(email, value.code);
        onVerified();
      } catch {
        onError(content.otpError.value);
      }
    },
    validators: { onChange: z.object({ code: z.string().length(OTP_LENGTH) }) },
  });

  return (
    <OtpStepForm onSubmit={() => void form.handleSubmit()}>
      <form.Field name="code">
        {(field) => (
          <Field
            data-invalid={
              field.state.meta.isTouched && !field.state.meta.isValid
            }
          >
            <FieldLabel htmlFor={field.name}>
              {content.codeInstructions({ email })}
            </FieldLabel>
            <InputOTP
              id={field.name}
              maxLength={OTP_LENGTH}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              containerClassName="w-full"
            >
              <InputOTPGroup className="w-full">
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-11 flex-1"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <Field>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              loading={form.state.isSubmitting}
            >
              {content.verifyCode}
            </Button>
          )}
        </form.Subscribe>
      </Field>

      <Field>
        <Button type="button" variant="ghost" onClick={onChangeEmail}>
          {content.changeEmail}
        </Button>
      </Field>
    </OtpStepForm>
  );
}
