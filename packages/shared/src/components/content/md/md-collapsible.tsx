"use client";

import type { ReactNode } from "react";

import { ChevronRightIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wowlab/shared/components/ui/collapsible";

type MdCollapsibleProps = {
  children: ReactNode;
  title: string;
  defaultOpen?: boolean;
};

export function MdCollapsible({
  children,
  defaultOpen = false,
  title,
}: Readonly<MdCollapsibleProps>) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center gap-1 py-2 hover:text-foreground [&[data-state=open]>svg]:rotate-90">
        <ChevronRightIcon className="size-4 transition-transform" />
        <span className="font-medium">{title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6">{children}</CollapsibleContent>
    </Collapsible>
  );
}
