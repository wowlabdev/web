"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";

import { Button } from "@wowlab/shared/components/ui/button";
import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";

type CopyDiagnosticsButtonProps = {
  getValue: () => string;
};

export function CopyDiagnosticsButton({
  getValue,
}: Readonly<CopyDiagnosticsButtonProps>) {
  const { copied, copy } = useClipboard();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={() => copy(getValue())}
    >
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <ClipboardIcon className="size-3.5" />
      )}
    </Button>
  );
}
