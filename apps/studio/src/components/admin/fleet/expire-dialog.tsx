"use client";

import { useIntlayer } from "next-intlayer";

import type { FleetNode } from "@/lib/query/services";

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

type ExpireDialogProps = {
  target: FleetNode | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ExpireDialog({
  isPending,
  onClose,
  onConfirm,
  target,
}: Readonly<ExpireDialogProps>) {
  const content = useIntlayer("admin");

  return (
    <AlertDialog
      open={target !== null}
      onOpenChange={(next) => !next && onClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.fleet.expireNode}</AlertDialogTitle>
          <AlertDialogDescription>
            {content.fleet.expireConfirm}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            {content.fleet.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={onConfirm}
          >
            {content.fleet.expire}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
