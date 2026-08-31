"use client";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@wowlab/shared/components/ui/alert-dialog";

type BlockCombinationsDialogProps = {
  combinationCount: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BlockCombinationsDialog({
  combinationCount,
  isOpen,
  onOpenChange,
}: Readonly<BlockCombinationsDialogProps>) {
  const content = useIntlayer("simulateBags");
  const fmtNumber = useNumber();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.blockDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {content.blockDialogBody({
              count: fmtNumber(combinationCount, { maximumFractionDigits: 0 }),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>{content.blockDialogConfirm}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
