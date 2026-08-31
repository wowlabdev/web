"use client";

import { useForm } from "@tanstack/react-form";
import { useIntlayer } from "next-intlayer";
import { z } from "zod";

import { useUserAccount } from "@/lib/query/services/user";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import { Field, FieldError } from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";

type SettingsDeleteDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsDeleteDialog({
  isOpen,
  onOpenChange,
}: Readonly<SettingsDeleteDialogProps>) {
  const { deleteAccount, user } = useUserAccount();
  const content = useIntlayer("accountPage");

  const handle = user.handle;

  const form = useForm({
    defaultValues: { confirm: "" },
    onSubmit: async () => {
      await deleteAccount();
      window.location.href = "/";
    },
    validators: {
      onChange: z.object({
        confirm: z
          .string()
          .refine(
            (value) => value === handle,
            content.settingsDeleteConfirmMismatch.value,
          ),
      }),
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset();
    }

    onOpenChange(next);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle>{content.settingsDeleteTitle}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {content.settingsDeleteDescription}
          </p>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <Alert variant="destructive">
            <AlertTitle>{content.settingsDeleteWarningTitle}</AlertTitle>
            <AlertDescription>{content.settingsDeleteWarning}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {content.settingsDeleteListLabel}
            </p>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>{content.settingsDeleteListItemRotations}</li>
              <li>{content.settingsDeleteListItemJobs}</li>
              <li>{content.settingsDeleteListItemBalance}</li>
              <li>{content.settingsDeleteListItemHandle}</li>
            </ul>
          </div>

          <form.Field name="confirm">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <p className="text-sm">
                  {content.settingsDeleteConfirmPrompt({ handle })}
                </p>
                <Input
                  placeholder={handle || ""}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <DialogFooter className="mt-4 gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {content.settingsDeleteCancel}
              </Button>
            </DialogClose>
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting
                    ? content.settingsDeleteConfirmPending
                    : content.settingsDeleteConfirm}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
