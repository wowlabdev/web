"use client";

import type { ValidationError } from "wowlab-engine";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";

import type { ActionEntry } from "../types";

import { useEditorUi } from "../editor-store-provider";
import { findErrorTarget } from "./find-error-target";
import { renderError, renderErrorBadge } from "./render-error";

type ValidationErrorItemProps = {
  error: ValidationError;
  lists: Record<string, ActionEntry[]>;
};

export function ValidationErrorItem({
  error,
  lists,
}: Readonly<ValidationErrorItemProps>) {
  const content = useIntlayer("rotationEditor");
  const setSelectionFocus = useEditorUi((s) => s.setSelectionFocus);
  const target = findErrorTarget(error, lists);

  return (
    <li className="flex items-center gap-2">
      <Badge variant="outline" className="shrink-0">
        {renderErrorBadge(content, error.type)}
      </Badge>
      <span className="flex-1">{renderError(content, error)}</span>
      {target && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-xs"
          onClick={() => {
            if (target.kind === "action") {
              setSelectionFocus({
                actionIndex: target.actionIndex,
                listId: target.listId,
              });
            } else {
              setSelectionFocus({
                actionIndex: 0,
                listId: target.listId,
              });
            }
          }}
        >
          {target.kind === "action"
            ? content.validationJumpLabel
            : content.validationJumpListLabel}
        </Button>
      )}
    </li>
  );
}
