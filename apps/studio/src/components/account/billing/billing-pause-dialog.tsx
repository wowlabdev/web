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

type BillingPauseDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  error: Error | null;
  isDisabled: boolean;
  onConfirm: () => void;
};

export function BillingPauseDialog({
  error,
  isDisabled,
  isOpen,
  isPending,
  onConfirm,
  onOpenChange,
}: Readonly<BillingPauseDialogProps>) {
  const content = useIntlayer("accountPage");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle>{content.billingPauseTitle}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {content.billingPauseDescription}
          </p>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>{content.billingErrorTitle}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4 gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">{content.billingPauseKeep}</Button>
          </DialogClose>
          <Button loading={isPending} disabled={isDisabled} onClick={onConfirm}>
            {isPending
              ? content.billingPauseConfirmPending
              : content.billingPauseConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
