"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
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
import {
  MAX_GUILD_SLOTS,
  MIN_GUILD_SLOTS,
  SLOT_RATE,
} from "@wowlab/shared/lib/billing/constants";

type BillingChangeSlotsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slots: number;
  onSlotsChange: (slots: number) => void;
  currentSlots: number | undefined;
  isPending: boolean;
  error: Error | null;
  onConfirm: () => void;
};

export function BillingChangeSlotsDialog({
  currentSlots,
  error,
  isOpen,
  isPending,
  onConfirm,
  onOpenChange,
  onSlotsChange,
  slots,
}: Readonly<BillingChangeSlotsDialogProps>) {
  const content = useIntlayer("accountPage");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle>{content.billingChangeSlotsTitle}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {content.billingChangeSlotsDescription}
          </p>
        </DialogHeader>

        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onSlotsChange(Math.max(MIN_GUILD_SLOTS, slots - 1))}
            disabled={slots <= MIN_GUILD_SLOTS}
          >
            <MinusIcon className="size-4" />
          </Button>
          <span className="text-2xl font-bold tabular-nums w-16 text-center">
            {slots}
          </span>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onSlotsChange(Math.min(MAX_GUILD_SLOTS, slots + 1))}
            disabled={slots >= MAX_GUILD_SLOTS}
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <p className="text-muted-foreground text-center text-sm tabular-nums">
          {content.billingChangeSlotsPrice({
            rate: String(SLOT_RATE),
            slots: String(slots),
            total: String(slots * SLOT_RATE),
          })}
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>{content.billingErrorTitle}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4 gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">{content.billingChangeSlotsKeep}</Button>
          </DialogClose>
          <Button
            loading={isPending}
            disabled={slots === currentSlots}
            onClick={onConfirm}
          >
            {isPending
              ? content.billingChangeSlotsConfirmPending
              : content.billingChangeSlotsConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
