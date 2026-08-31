"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { Fragment } from "react";

import type { FleetNode } from "@/lib/query/services";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { TableCell, TableRow } from "@wowlab/shared/components/ui/table";

import type { NodeActionHandlers } from "./types";

import { LastSeenCell } from "./last-seen-cell";
import { NodeActionsMenu } from "./node-actions-menu";
import { NodeDetail } from "./node-detail";

type NodeRowProps = {
  node: FleetNode;
  isOpen: boolean;
  onToggle: (id: string) => void;
} & NodeActionHandlers;

export function NodeRow({
  isOpen,
  node,
  onDelete,
  onExpire,
  onRename,
  onSetTags,
  onToggle,
}: NodeRowProps) {
  const content = useIntlayer("admin");
  const fmtNumber = useNumber();

  return (
    <Fragment>
      <TableRow>
        <TableCell className="font-medium">{node.givenName}</TableCell>
        <TableCell>
          <Badge variant={node.online ? "default" : "secondary"}>
            {node.online ? content.fleet.online : content.fleet.offline}
          </Badge>
        </TableCell>
        <TableCell className="text-right font-mono text-xs">
          {fmtNumber(node.chunksCompleted)}
        </TableCell>
        <TableCell className="text-muted-foreground text-xs">
          <LastSeenCell node={node} />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <NodeActionsMenu
              node={node}
              onRename={onRename}
              onSetTags={onSetTags}
              onExpire={onExpire}
              onDelete={onDelete}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onToggle(node.id)}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <ChevronUpIcon className="size-4" />
              ) : (
                <ChevronDownIcon className="size-4" />
              )}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={5} className="bg-muted/20 p-0">
            <NodeDetail node={node} />
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}
