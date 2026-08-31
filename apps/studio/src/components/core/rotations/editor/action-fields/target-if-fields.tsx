"use client";

import { useBoolean } from "ahooks";
import { ChevronDownIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type {
  ActionEntry,
  Condition,
  ConditionEditorCtx,
  TargetIf,
  TargetIfMode,
} from "../types";

import { ConditionBuilder } from "../condition/condition-builder";
import { createDefaultCondition } from "../types";

type TargetIfFieldsProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
  conditionCtx: ConditionEditorCtx;
};

export function TargetIfFields({
  conditionCtx,
  draft,
  onChange,
}: Readonly<TargetIfFieldsProps>) {
  const content = useIntlayer("rotationEditor");
  const existing = draft.target_if;
  const [
    isExpanded,
    { setFalse: collapse, setTrue: expand, toggle: toggleExpanded },
  ] = useBoolean(Boolean(existing));

  const handleToggle = () => {
    if (existing) {
      toggleExpanded();

      return;
    }

    onChange({ target_if: { expr: createDefaultCondition(), mode: "first" } });
    expand();
  };

  const handleClear = () => {
    onChange({ target_if: undefined });
    collapse();
  };

  const update = (next: TargetIf) => onChange({ target_if: next });

  return (
    <div className="space-y-2 border-t border-border/40 pt-2">
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-xs"
          onClick={handleToggle}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <ChevronDownIcon className="size-3" />
          ) : (
            <ChevronRightIcon className="size-3" />
          )}
          {content.targetIfSectionLabel}
        </Button>
        {existing && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-6"
            onClick={handleClear}
            aria-label={content.targetIfClearAria.value}
          >
            <XIcon className="size-3" />
          </Button>
        )}
      </div>
      {isExpanded && existing && (
        <div className="space-y-2 pl-4">
          <div className="space-y-1">
            <Label className="text-xs">{content.targetIfModeLabel}</Label>
            <Select
              value={existing.mode}
              onValueChange={(value) =>
                update({ ...existing, mode: value as TargetIfMode })
              }
            >
              <SelectTrigger size="sm" className="h-7 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">
                  {content.targetIfModeFirst}
                </SelectItem>
                <SelectItem value="max">{content.targetIfModeMax}</SelectItem>
                <SelectItem value="min">{content.targetIfModeMin}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{content.targetIfExprLabel}</Label>
            <ConditionBuilder
              value={existing.expr}
              onChange={(expr: Condition) => update({ ...existing, expr })}
              ctx={conditionCtx}
            />
          </div>
        </div>
      )}
    </div>
  );
}
