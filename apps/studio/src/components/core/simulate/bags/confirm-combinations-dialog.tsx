"use client";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@wowlab/shared/components/ui/alert-dialog";

type ConfirmCombinationsDialogProps = {
  combinationCount: number;
  isOpen: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmCombinationsDialog({
  combinationCount,
  isOpen,
  onConfirm,
  onOpenChange,
}: Readonly<ConfirmCombinationsDialogProps>) {
  const content = useIntlayer("simulateBags");
  const fmtNumber = useNumber();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.confirmDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {content.confirmDialogBody({
              count: fmtNumber(combinationCount, { maximumFractionDigits: 0 }),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{content.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {content.confirmDialogConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
