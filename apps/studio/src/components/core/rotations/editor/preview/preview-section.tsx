"use client";

import type { ReactNode } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemoizedFn } from "ahooks";
import { ChevronDownIcon, GripVerticalIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wowlab/shared/components/ui/collapsible";
import { cn } from "@wowlab/shared/lib/utils";

type PreviewSectionProps = {
  children: ReactNode;
  description?: ReactNode;
  id: string;
  isCollapsed: boolean;
  onCollapseChange: (next: boolean) => void;
  title: ReactNode;
};

type Sortable = ReturnType<typeof useSortable>;

export function PreviewSection({
  children,
  description,
  id,
  isCollapsed,
  onCollapseChange,
  title,
}: Readonly<PreviewSectionProps>) {
  const content = useIntlayer("rotationEditor");
  const sortable = useSortable({ id });
  const setNodeRef = useMemoizedFn((node: HTMLDivElement | null) => {
    sortable.setNodeRef(node);
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      className={cn(sortable.isDragging && "z-10 opacity-60 shadow-lg")}
    >
      <Card>
        <Collapsible
          open={!isCollapsed}
          onOpenChange={(open) => onCollapseChange(!open)}
        >
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <SectionDragHandle
              ariaLabel={content.previewSectionDragAriaLabel.value}
              attributes={sortable.attributes}
              listeners={sortable.listeners}
            />
            <div className="min-w-0 flex-1">
              <CardTitle>{title}</CardTitle>
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </div>
            <CollapsibleTrigger asChild>
              <Button
                aria-label={
                  isCollapsed
                    ? content.previewSectionExpandAriaLabel.value
                    : content.previewSectionCollapseAriaLabel.value
                }
                size="icon-sm"
                variant="ghost"
              >
                <ChevronDownIcon
                  className={cn(
                    "size-4 transition-transform",
                    isCollapsed && "-rotate-90",
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>{children}</CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}

function SectionDragHandle({
  ariaLabel,
  attributes,
  listeners,
}: Readonly<{
  ariaLabel: string;
  attributes: Sortable["attributes"];
  listeners: Sortable["listeners"];
}>) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVerticalIcon className="size-4" />
    </button>
  );
}
