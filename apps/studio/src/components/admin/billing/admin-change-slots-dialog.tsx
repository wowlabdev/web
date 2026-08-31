"use client";

import { useForm } from "@tanstack/react-form";
import { useIntlayer } from "next-intlayer";
import { z } from "zod";

import { useAdminUpdateSubscription } from "@/lib/query/services";
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
import {
  Field,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";
import { env } from "@wowlab/shared/lib/env";

type AdminChangeSlotsDialogProps = {
  currentQuantity: number;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  priceId: string;
  subscriptionId: string;
};

export function AdminChangeSlotsDialog({
  currentQuantity,
  isOpen,
  onOpenChange,
  priceId,
  subscriptionId,
}: Readonly<AdminChangeSlotsDialogProps>) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <AdminChangeSlotsDialogInner
          currentQuantity={currentQuantity}
          key={`${subscriptionId}-${currentQuantity}`}
          onOpenChange={onOpenChange}
          priceId={priceId}
          subscriptionId={subscriptionId}
        />
      </DialogContent>
    </Dialog>
  );
}

function AdminChangeSlotsDialogInner({
  currentQuantity,
  onOpenChange,
  priceId,
  subscriptionId,
}: Readonly<Omit<AdminChangeSlotsDialogProps, "isOpen">>) {
  const content = useIntlayer("admin");
  const update = useAdminUpdateSubscription();

  const form = useForm({
    defaultValues: { quantity: String(currentQuantity) },
    onSubmit: async ({ value }) => {
      try {
        await update.mutateAsync({
          priceId: priceId || env.PADDLE_PRICE_GUILD_SLOT,
          quantity: Number(value.quantity),
          subscriptionId,
        });
        onOpenChange(false);
      } catch {
        // surfaced via update.error
      }
    },
    validators: {
      onChange: z.object({
        quantity: z
          .string()
          .refine(
            (value) => Number.isInteger(Number(value)) && Number(value) > 0,
          ),
      }),
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <DialogHeader className="space-y-2">
        <DialogTitle>{content.billingSlotsDialog.title}</DialogTitle>
        <p className="text-muted-foreground text-sm">
          {content.billingSlotsDialog.description}
        </p>
      </DialogHeader>

      <div className="py-2">
        <form.Field name="quantity">
          {(field) => (
            <Field
              data-invalid={
                field.state.meta.isTouched && !field.state.meta.isValid
              }
            >
              <FieldLabel htmlFor={field.name}>
                {content.billingSlotsDialog.quantity}
              </FieldLabel>
              <Input
                id={field.name}
                min={1}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
      </div>

      {update.error && (
        <Alert variant="destructive">
          <AlertTitle>{content.billingSlotsDialog.errorTitle}</AlertTitle>
          <AlertDescription>{update.error.message}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-4 gap-2 sm:justify-end">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {content.billingSlotsDialog.cancel}
          </Button>
        </DialogClose>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.values.quantity]}
        >
          {([canSubmit, quantity]) => (
            <Button
              type="submit"
              disabled={
                update.isPending ||
                !canSubmit ||
                Number(quantity) === currentQuantity
              }
            >
              {update.isPending
                ? content.billingSlotsDialog.updating
                : content.billingSlotsDialog.updateSlots}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}
