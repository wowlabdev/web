"use client";

import {
  MoreHorizontalIcon,
  PencilIcon,
  TagIcon,
  TimerOffIcon,
  Trash2Icon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { FleetNode } from "@/lib/query/services";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";

import type { NodeActionHandlers } from "./types";

type NodeActionsMenuProps = {
  node: FleetNode;
} & NodeActionHandlers;

export function NodeActionsMenu({
  node,
  onDelete,
  onExpire,
  onRename,
  onSetTags,
}: NodeActionsMenuProps) {
  const content = useIntlayer("admin");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">{content.fleet.actions}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onRename(node)}>
          <PencilIcon className="size-4" />
          {content.fleet.rename}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSetTags(node)}>
          <TagIcon className="size-4" />
          {content.fleet.setTags}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onExpire(node)}>
          <TimerOffIcon className="size-4" />
          {content.fleet.expire}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(node)}>
          <Trash2Icon className="size-4" />
          {content.fleet.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
