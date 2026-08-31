"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";
import { create } from "zustand";

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

type ConfirmOptions = {
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  description: ReactNode;
  isDestructive?: boolean;
  title?: ReactNode;
};

type ConfirmStore = {
  isOpen: boolean;
  options: ConfirmOptions | null;
  request: (options: ConfirmOptions) => Promise<boolean>;
  resolve: ((confirmed: boolean) => void) | null;
  settle: (confirmed: boolean) => void;
};

const useConfirmStore = create<ConfirmStore>((set, get) => ({
  isOpen: false,
  options: null,
  request: (options) =>
    new Promise<boolean>((resolve) => {
      set({ isOpen: true, options, resolve });
    }),
  resolve: null,
  settle: (confirmed) => {
    get().resolve?.(confirmed);
    set({ isOpen: false, resolve: null });
  },
}));

export function ConfirmDialogHost() {
  const content = useIntlayer("commonComponents");
  const isOpen = useConfirmStore((state) => state.isOpen);
  const options = useConfirmStore((state) => state.options);
  const settle = useConfirmStore((state) => state.settle);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          settle(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {options?.title ?? content.confirmTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {options?.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => settle(false)}>
            {options?.cancelLabel ?? content.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={options?.isDestructive ? "destructive" : "default"}
            onClick={() => settle(true)}
          >
            {options?.confirmLabel ?? content.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useConfirm(): (options: ConfirmOptions) => Promise<boolean> {
  return useConfirmStore((state) => state.request);
}
