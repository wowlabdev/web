"use client";

import { useForm } from "@tanstack/react-form";
import { PlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { z } from "zod";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Field, FieldLabel } from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";

type AddHandleCardProps = {
  isPending: boolean;
  onAdd: (handle: string, reason: string) => Promise<void>;
};

export function AddHandleCard({
  isPending,
  onAdd,
}: Readonly<AddHandleCardProps>) {
  const content = useIntlayer("admin");

  const form = useForm({
    defaultValues: { handle: "", reason: "" },
    onSubmit: async ({ value }) => {
      await onAdd(value.handle.trim().toLowerCase(), value.reason.trim());
      form.reset();
    },
    validators: {
      onChange: z.object({
        handle: z.string().trim().min(1),
        reason: z.string().trim().min(1),
      }),
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.handles.addReservedHandle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
        >
          <form.Field name="handle">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="reserved-handle">
                  {content.handles.handle}
                </FieldLabel>
                <Input
                  id="reserved-handle"
                  placeholder={content.handles.handle.value}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="reason">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="reserved-reason">
                  {content.handles.reason}
                </FieldLabel>
                <Input
                  id="reserved-reason"
                  placeholder={content.handles.reasonPlaceholder.value}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <div className="self-end">
                <Button type="submit" disabled={!canSubmit || isPending}>
                  <PlusIcon className="size-4" />
                  {isPending ? content.handles.adding : content.handles.add}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
