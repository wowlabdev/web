"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";

import type { ActionIssue } from "../validation/use-action-issues";

type ActionIssueBadgesProps = {
  issues: ActionIssue[];
};

export function ActionIssueBadges({
  issues,
}: Readonly<ActionIssueBadgesProps>) {
  const content = useIntlayer("rotationEditor");

  if (issues.length === 0) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="destructive" className="shrink-0 gap-1 text-xs">
          <AlertTriangleIcon className="size-3" />
          {issues.length}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <ul className="space-y-0.5 text-xs">
          {issues.map((issue, i) => (
            <li key={`${issue.kind}-${issue.slug ?? issue.listName ?? i}`}>
              {renderIssue(content, issue)}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}

function renderIssue(
  content: ReturnType<typeof useIntlayer>,
  issue: ActionIssue,
): string {
  switch (issue.kind) {
    case "duplicate_list": {
      return content.actionIssueDuplicateList({
        name: issue.listName ?? "",
      }).value;
    }

    case "empty_list": {
      return content.actionIssueEmptyList({
        name: issue.listName ?? "",
      }).value;
    }

    case "invalid_expression": {
      return content.actionIssueInvalidExpression.value;
    }

    case "type_mismatch": {
      return content.actionIssueTypeMismatch.value;
    }

    case "undefined_list": {
      return content.actionIssueUndefinedList({
        name: issue.listName ?? "",
      }).value;
    }

    case "undefined_variable": {
      return content.actionIssueUndefinedVariable({
        name: issue.listName ?? "",
      }).value;
    }

    case "unknown_aura": {
      return content.actionIssueUnknownAura({
        name: issue.slug ?? "",
      }).value;
    }

    case "unknown_spell": {
      return content.actionIssueUnknownSpell({
        name: issue.slug ?? "",
      }).value;
    }

    case "unknown_talent": {
      return content.actionIssueUnknownTalent({
        name: issue.slug ?? "",
      }).value;
    }
  }
}
