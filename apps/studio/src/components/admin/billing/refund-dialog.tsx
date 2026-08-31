"use client";

import type { AdminTransaction } from "@/lib/paddle/transactions";

import { Dialog, DialogContent } from "@wowlab/shared/components/ui/dialog";

import { RefundDialogInner } from "./refund-dialog-inner";

type RefundDialogProps = {
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  transaction: AdminTransaction | null;
};

export function RefundDialog({
  isOpen,
  onOpenChange,
  transaction,
}: Readonly<RefundDialogProps>) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-lg">
        {transaction && (
          <RefundDialogInner
            key={transaction.id}
            onOpenChange={onOpenChange}
            transaction={transaction}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
