"use client";

import type { ReactNode } from "react";

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

type SubscriptionActionDialogProps = {
  cancelLabel: ReactNode;
  children?: ReactNode;
  confirmLabel: ReactNode;
  confirmVariant?: "default" | "destructive";
  description: ReactNode;
  error?: Error | null;
  errorTitle: ReactNode;
  isOpen: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
};

export function SubscriptionActionDialog({
  cancelLabel,
  children,
  confirmLabel,
  confirmVariant = "default",
  description,
  error,
  errorTitle,
  isOpen,
  isPending,
  onConfirm,
  onOpenChange,
  title,
}: Readonly<SubscriptionActionDialogProps>) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle>{title}</DialogTitle>
          <p className="text-muted-foreground text-sm">{description}</p>
        </DialogHeader>

        {children}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4 gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
          <Button
            disabled={isPending}
            onClick={onConfirm}
            variant={confirmVariant}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
