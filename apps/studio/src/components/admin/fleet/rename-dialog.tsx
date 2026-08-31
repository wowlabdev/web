"use client";

import { useForm } from "@tanstack/react-form";
import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { z } from "zod";

import type { FleetNode } from "@/lib/query/services";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";

type RenameDialogProps = {
  target: FleetNode | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
};

export function RenameDialog({
  isPending,
  onClose,
  onSubmit,
  target,
}: Readonly<RenameDialogProps>) {
  const content = useIntlayer("admin");
  const currentName = target?.givenName ?? "";

  const form = useForm({
    defaultValues: { name: currentName },
    onSubmit: ({ value }) => {
      onSubmit(value.name.trim());
    },
    validators: {
      onChange: z.object({
        name: z
          .string()
          .trim()
          .regex(/^[a-zA-Z0-9\-.]+$/, content.fleet.nameInvalid.value)
          .refine(
            (next) => next !== currentName,
            content.fleet.nameUnchanged.value,
          ),
      }),
    },
  });

  const handleOpenChange = useMemoizedFn((next: boolean) => {
    if (next && target) {
      form.reset({ name: target.givenName });
    } else {
      onClose();
    }
  });

  return (
    <Dialog open={target !== null} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.fleet.renameNode}</DialogTitle>
          <DialogDescription>{target?.givenName}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>
                  {content.fleet.name}
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {content.fleet.cancel}
            </Button>
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {content.fleet.rename}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
