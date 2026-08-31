"use client";

import type { ReactNode } from "react";

import { useBoolean } from "ahooks";
import { MaximizeIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import { cn } from "@wowlab/shared/lib/utils";

export const LANDING_MEDIA_FRAME_CLASS =
  "relative w-full overflow-hidden border border-white/20 bg-background shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)]";

type LandingMediaExpandProps = {
  className?: string;
  dialogClassName?: string;
  expanded: ReactNode;
  title: string;
};

export function LandingMediaExpand({
  className,
  dialogClassName,
  expanded,
  title,
}: Readonly<LandingMediaExpandProps>) {
  const content = useIntlayer("landingPage");
  const [isOpen, { setFalse: close, setTrue: open }] = useBoolean(false);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={cn(
          "group/preview absolute inset-0 flex cursor-zoom-in items-end justify-end bg-transparent p-3",
          className,
        )}
        aria-label={content.mediaExpandAriaLabel({ title }).value}
      >
        <span className="flex items-center gap-1.5 rounded-md bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/preview:opacity-100 motion-reduce:transition-none">
          <MaximizeIcon className="size-3.5" />
          {content.mediaClickToExpand}
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
        <DialogContent
          className={cn(
            "max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-5xl",
            dialogClassName,
          )}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {content.mediaExpandedPreview({ title })}
          </DialogDescription>
          {expanded}
        </DialogContent>
      </Dialog>
    </>
  );
}
