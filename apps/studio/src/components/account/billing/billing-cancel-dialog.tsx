"use client";

import { useIntlayer } from "next-intlayer";

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

type BillingCancelDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  periodEndLabel: string;
  isPending: boolean;
  error: Error | null;
  isDisabled: boolean;
  onConfirm: () => void;
};

export function BillingCancelDialog({
  error,
  isDisabled,
  isOpen,
  isPending,
  onConfirm,
  onOpenChange,
  periodEndLabel,
}: Readonly<BillingCancelDialogProps>) {
  const content = useIntlayer("accountPage");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle>{content.billingCancelTitle}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {content.billingCancelDescription}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>{content.billingCancelHeadsUp}</AlertTitle>
            <AlertDescription>
              {content.billingCancelHeadsUpBody({ date: periodEndLabel })}
            </AlertDescription>
          </Alert>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{content.billingErrorTitle}</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="mt-4 gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">{content.billingCancelKeep}</Button>
          </DialogClose>
          <Button
            variant="destructive"
            loading={isPending}
            disabled={isDisabled}
            onClick={onConfirm}
          >
            {isPending
              ? content.billingCancelConfirmPending
              : content.billingCancelConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
