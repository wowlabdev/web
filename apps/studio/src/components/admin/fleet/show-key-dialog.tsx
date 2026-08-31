"use client";

import { useIntlayer } from "next-intlayer";

import { CodeBlock } from "@/components/dev";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";

type ShowKeyDialogProps = {
  keyValue: string | null;
  onClose: () => void;
};

export function ShowKeyDialog({
  keyValue,
  onClose,
}: Readonly<ShowKeyDialogProps>) {
  const content = useIntlayer("admin");

  return (
    <Dialog
      open={keyValue !== null}
      onOpenChange={(next) => !next && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.fleet.keyCreated}</DialogTitle>
          <DialogDescription>{content.fleet.copyKey}</DialogDescription>
        </DialogHeader>
        {keyValue && <CodeBlock>{keyValue}</CodeBlock>}
        <DialogFooter>
          <Button onClick={onClose}>{content.fleet.done}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
