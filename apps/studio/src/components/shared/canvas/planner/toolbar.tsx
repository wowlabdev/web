"use client";

import {
  HexagonIcon,
  ImageIcon,
  type LucideIcon,
  MapPinIcon,
  MousePointer2Icon,
  PencilIcon,
  Redo2Icon,
  TagIcon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import { Separator } from "@wowlab/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";
import { cn } from "@wowlab/shared/lib/utils";

import type { AnnotationTool } from "./annotation-builder";

import { ANNOTATION_PALETTE } from "./annotation-palette";
import { ToolButton } from "./tool-button";

type ToolbarProps = {
  tool: AnnotationTool;
  color: string;
  canUndo: boolean;
  canRedo: boolean;
  canClear: boolean;
  onSelectTool: (tool: AnnotationTool) => void;
  onColorChange: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
};

const TOOL_ITEMS: ReadonlyArray<{
  icon: LucideIcon;
  labelKey:
    "toolMarker" | "toolPath" | "toolPolygon" | "toolSelect" | "toolText";
  tool: AnnotationTool;
}> = [
  { icon: MousePointer2Icon, labelKey: "toolSelect", tool: "select" },
  { icon: MapPinIcon, labelKey: "toolMarker", tool: "marker" },
  { icon: TagIcon, labelKey: "toolText", tool: "text" },
  { icon: PencilIcon, labelKey: "toolPath", tool: "path" },
  { icon: HexagonIcon, labelKey: "toolPolygon", tool: "polygon" },
];

export function Toolbar({
  canClear,
  canRedo,
  canUndo,
  color,
  onClear,
  onColorChange,
  onExport,
  onRedo,
  onSelectTool,
  onUndo,
  tool,
}: Readonly<ToolbarProps>) {
  const content = useIntlayer("canvasPlanner");

  return (
    <div className="bg-background/90 ring-border pointer-events-auto absolute right-3 top-3 flex items-center gap-1 border p-1 backdrop-blur ring-1">
      {TOOL_ITEMS.map(({ icon: Icon, labelKey, tool: itemTool }) => (
        <ToolButton
          key={itemTool}
          isActive={tool === itemTool}
          icon={<Icon className="size-4" />}
          label={content[labelKey].value}
          onClick={() => onSelectTool(itemTool)}
        />
      ))}

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="size-8 p-0"
            aria-label={content.annotationColorAriaLabel.value}
          >
            <span
              className="block size-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-2">
          <div className="flex gap-1">
            {ANNOTATION_PALETTE.map((swatch) => (
              <button
                key={swatch}
                type="button"
                className={cn(
                  "size-6 rounded-full border",
                  swatch === color ? "border-foreground" : "border-transparent",
                )}
                style={{ backgroundColor: swatch }}
                onClick={() => onColorChange(swatch)}
                aria-label={content.setColor({ color: swatch }).value}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolButton
        icon={<Undo2Icon className="size-4" />}
        label={content.undo.value}
        onClick={onUndo}
        isDisabled={!canUndo}
      />
      <ToolButton
        icon={<Redo2Icon className="size-4" />}
        label={content.redo.value}
        onClick={onRedo}
        isDisabled={!canRedo}
      />
      <ToolButton
        icon={<Trash2Icon className="size-4" />}
        label={content.clearAll.value}
        onClick={onClear}
        isDisabled={!canClear}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="default"
            className="h-8 gap-1"
            onClick={onExport}
          >
            <ImageIcon className="size-4" />
            <span>PNG</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{content.exportPng}</TooltipContent>
      </Tooltip>
    </div>
  );
}
