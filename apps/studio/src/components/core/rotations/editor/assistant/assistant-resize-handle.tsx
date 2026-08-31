"use client";

import type { HTMLAttributes } from "react";

import { useIntlayer } from "next-intlayer";

type AssistantResizeHandleProps = Pick<
  HTMLAttributes<HTMLDivElement>,
  "onPointerDown" | "onPointerMove" | "onPointerUp"
>;

export function AssistantResizeHandle(
  props: Readonly<AssistantResizeHandleProps>,
) {
  const content = useIntlayer("rotationAssistant");

  return (
    <div
      {...props}
      aria-label={content.resizeAriaLabel.value}
      aria-orientation="vertical"
      className="absolute inset-y-0 left-0 z-20 w-1.5 cursor-ew-resize hover:bg-primary/40 active:bg-primary/60"
      role="separator"
    />
  );
}
