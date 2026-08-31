"use client";

import { useForm } from "@tanstack/react-form";
import { LinkIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";
import { z } from "zod";

import { useGenerateShortUrl } from "@/lib/query/services";
import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";
import { toast } from "@wowlab/shared/components/ui/sonner";
import { absoluteUrl } from "@wowlab/shared/lib/routing/utils";

type GenerateCardProps = {
  mutation: ReturnType<typeof useGenerateShortUrl>;
};

export function GenerateCard({ mutation }: Readonly<GenerateCardProps>) {
  const content = useIntlayer("admin");

  const generatedUrl = useMemo(() => {
    if (!mutation.data) {
      return null;
    }

    try {
      return absoluteUrl(mutation.data);
    } catch {
      return mutation.data;
    }
  }, [mutation.data]);

  const form = useForm({
    defaultValues: { targetUrl: "" },
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync(value.targetUrl.trim());
        toast.success(content.shortUrls.createSuccess.value);
        form.reset();
      } catch {
        toast.error(content.shortUrls.createFailed.value);
      }
    },
    validators: {
      onChange: z.object({
        targetUrl: z.string().trim().min(1),
      }),
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="size-4" />
          {content.shortUrls.shortUrl}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-3"
        >
          <form.Field name="targetUrl">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>
                  {content.shortUrls.targetUrl}
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder={content.shortUrls.targetUrl.value}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    mutation.reset();
                  }}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Button
                type="submit"
                size="sm"
                variant="outline"
                disabled={!canSubmit || mutation.isPending}
              >
                {mutation.isPending
                  ? content.shortUrls.generating
                  : content.shortUrls.generate}
              </Button>
            )}
          </form.Subscribe>
        </form>

        {generatedUrl && (
          <div className="space-y-1 text-sm">
            <p>{content.shortUrls.generated}:</p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={generatedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline break-all font-mono"
              >
                {generatedUrl}
              </a>
              <CopyButton value={generatedUrl} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
