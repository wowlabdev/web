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

type DeleteDialogProps = {
  target: FleetNode | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteDialog({
  isPending,
  onClose,
  onConfirm,
  target,
}: Readonly<DeleteDialogProps>) {
  const content = useIntlayer("admin");
  const currentName = target?.givenName ?? "";

  const form = useForm({
    defaultValues: { confirm: "" },
    onSubmit: () => {
      onConfirm();
    },
    validators: {
      onChange: z.object({
        confirm: z
          .string()
          .refine(
            (value) => value === currentName,
            content.fleet.confirmMismatch.value,
          ),
      }),
    },
  });

  const handleOpenChange = useMemoizedFn((next: boolean) => {
    if (next) {
      form.reset({ confirm: "" });
    } else {
      onClose();
    }
  });

  return (
    <Dialog open={target !== null} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.fleet.deleteNode}</DialogTitle>
          <DialogDescription>
            {content.fleet.deleteConfirm} ({target?.givenName})
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="confirm">
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
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={!canSubmit || isPending}
                >
                  {content.fleet.delete}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
