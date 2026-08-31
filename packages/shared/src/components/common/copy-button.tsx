"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { toast } from "@wowlab/shared/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";
import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";
import { cn } from "@wowlab/shared/lib/utils";

type CopyButtonProps = {
  className?: string;
  value: string;
};

export function CopyButton({ className, value }: Readonly<CopyButtonProps>) {
  const content = useIntlayer("commonComponents");
  const { copied, copy } = useClipboard();

  async function handleCopy() {
    try {
      await copy(value);
    } catch {
      toast.error(content.copyFailed.value);
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-7", className)}
          onClick={() => void handleCopy()}
        >
          {copied ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <ClipboardIcon className="size-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {copied ? content.copySuccess : content.copy}
      </TooltipContent>
    </Tooltip>
  );
}
