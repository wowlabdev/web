"use client";

import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Input } from "@wowlab/shared/components/ui/input";

import type { Vec2 } from "../scene/types";

export type TextEntryMode = {
  kind: "text";
  value: string;
  clientX: number;
  clientY: number;
  scenePoint: Vec2;
};

type TextEntryPopoverProps = {
  inputId: string;
  mode: TextEntryMode;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function TextEntryPopover({
  inputId,
  mode,
  onCancel,
  onChange,
  onSubmit,
}: Readonly<TextEntryPopoverProps>) {
  const content = useIntlayer("canvasPlanner");

  return (
    <div
      className="bg-background ring-border pointer-events-auto absolute flex items-center gap-1 border p-1 ring-1"
      style={{
        left: clamp(mode.clientX, 8, 9999),
        top: clamp(mode.clientY, 8, 9999),
      }}
    >
      <Input
        id={inputId}
        autoFocus
        value={mode.value}
        placeholder={content.annotationTextPlaceholder.value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
        className="h-8 w-48"
      />
      <Button type="button" size="sm" onClick={onSubmit}>
        {content.addText}
      </Button>
    </div>
  );
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}
