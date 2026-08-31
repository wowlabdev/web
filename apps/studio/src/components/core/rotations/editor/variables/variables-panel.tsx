"use client";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

import { useEditorUi } from "../editor-store-provider";
import { type ActionRef, useVariableUsages } from "./use-variable-usages";
import { firstUsage } from "./utils";

type UsageChipsProps = {
  refs: ActionRef[];
  emptyLabel: string;
  ariaTemplate: ReturnType<typeof useIntlayer>["variablesUsageAria"];
  moreLabel: ReturnType<typeof useIntlayer>["variablesUsageMore"];
  onJump: (ref: ActionRef) => void;
};

type VariablesPanelProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const USAGE_DISPLAY_LIMIT = 5;

export function VariablesPanel({
  isOpen,
  onOpenChange,
}: Readonly<VariablesPanelProps>) {
  const content = useIntlayer("rotationEditor");
  const usages = useVariableUsages();
  const setSelectionFocus = useEditorUi((s) => s.setSelectionFocus);
  const entries = Object.entries(usages).sort(([a], [b]) => a.localeCompare(b));

  const jumpTo = (ref: ActionRef) => {
    setSelectionFocus({
      actionIndex: ref.actionIndex,
      listId: ref.listId,
    });
    onOpenChange(false);
  };

  const handleJump = (target: ActionRef | null) => {
    if (!target) {
      return;
    }

    jumpTo(target);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{content.variablesPanelTitle}</DialogTitle>
          <DialogDescription>
            {content.variablesPanelDescription}
          </DialogDescription>
        </DialogHeader>
        {entries.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            {content.variablesPanelEmpty}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{content.variablesColumnName}</TableHead>
                <TableHead>{content.variablesColumnType}</TableHead>
                <TableHead>{content.variablesColumnSetAt}</TableHead>
                <TableHead>{content.variablesColumnReadAt}</TableHead>
                <TableHead className="text-right">
                  {content.variablesColumnActions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(([name, usage]) => {
                const target = firstUsage(usage);

                return (
                  <TableRow key={name}>
                    <TableCell>
                      <Badge variant="outline">{name}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {usage.inferredType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <UsageChips
                        refs={usage.setBy}
                        emptyLabel={content.variablesNoSet.value}
                        ariaTemplate={content.variablesUsageAria}
                        moreLabel={content.variablesUsageMore}
                        onJump={jumpTo}
                      />
                    </TableCell>
                    <TableCell>
                      <UsageChips
                        refs={usage.readBy}
                        emptyLabel={content.variablesNoRead.value}
                        ariaTemplate={content.variablesUsageAria}
                        moreLabel={content.variablesUsageMore}
                        onJump={jumpTo}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        disabled={!target}
                        onClick={() => handleJump(target)}
                      >
                        {content.variablesJumpLabel}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UsageChips({
  ariaTemplate,
  emptyLabel,
  moreLabel,
  onJump,
  refs,
}: Readonly<UsageChipsProps>) {
  if (refs.length === 0) {
    return <span className="text-xs text-muted-foreground">{emptyLabel}</span>;
  }

  const visible = refs.slice(0, USAGE_DISPLAY_LIMIT);
  const overflow = refs.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((ref, i) => (
        <Badge
          asChild
          // eslint-disable-next-line @eslint-react/no-array-index-key -- positional refs collected from an immutable script; one action can reference the same var multiple times, so (listId, actionIndex, location) is not unique
          key={`${ref.listId}-${ref.actionIndex}-${ref.location}-${i}`}
          variant="outline"
          className="cursor-pointer text-xs hover:bg-accent"
        >
          <button
            type="button"
            onClick={() => onJump(ref)}
            aria-label={
              ariaTemplate({
                index: ref.actionIndex,
                listId: ref.listId,
              }).value
            }
          >
            {ref.listId}#{ref.actionIndex}
          </button>
        </Badge>
      ))}
      {overflow > 0 && (
        <span className="text-xs text-muted-foreground">
          {moreLabel({ count: overflow }).value}
        </span>
      )}
    </div>
  );
}
