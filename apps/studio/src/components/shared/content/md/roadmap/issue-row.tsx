"use client";

import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { Issue } from "@/lib/github/types";

import { FormattedDate } from "@wowlab/shared/components/common";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { cn } from "@wowlab/shared/lib/utils";

import { AssignedUsers } from "./assigned-users";

type IssueRowProps = {
  issue: Issue;
};

export function IssueRow({ issue }: Readonly<IssueRowProps>) {
  const { roadmap: content } = useIntlayer("article");
  const isClosed = issue.state === "closed";
  const assignees = issue.assignees ?? [];
  const isInProgress = !isClosed && assignees.length > 0;
  const resolveStatusLabel = () => {
    if (isClosed) {
      return content.statusDone;
    }

    if (isInProgress) {
      return content.statusInProgress;
    }

    return content.statusOpen;
  };
  const statusLabel = resolveStatusLabel();

  return (
    <div className="flex items-start gap-3 rounded-none px-3 py-2.5 transition-colors hover:bg-muted/50">
      {isClosed ? (
        <CheckCircle2Icon className="mt-0.5 size-[18px] shrink-0 text-emerald-500" />
      ) : (
        <CircleDotIcon className="mt-0.5 size-[18px] shrink-0 text-blue-500" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words text-sm font-medium text-foreground no-underline hover:underline"
          >
            {issue.title}
            <ExternalLinkIcon className="ml-1 inline size-3 opacity-50" />
          </a>
          {issue.labels
            .filter(
              (label): label is Exclude<typeof label, string> =>
                typeof label !== "string",
            )
            .filter((label) => label.name !== "roadmap")
            .map((label) => (
              <Badge
                key={label.id}
                variant="outline"
                style={
                  label.color
                    ? {
                        backgroundColor: `#${label.color}20`,
                        borderColor: `#${label.color}40`,
                        color: `#${label.color}`,
                      }
                    : undefined
                }
              >
                {label.name}
              </Badge>
            ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {issue.updated_at && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                <FormattedDate
                  value={issue.updated_at}
                  day="numeric"
                  month="short"
                  year="numeric"
                />
              </span>
            </div>
          )}
          <AssignedUsers assignees={assignees} />
        </div>
      </div>
      <Badge
        variant={isClosed ? "default" : "outline"}
        className={cn(
          "shrink-0",
          isClosed &&
            "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          isInProgress &&
            "border-amber-500/40 text-amber-600 dark:text-amber-400",
          !isClosed &&
            !isInProgress &&
            "border-blue-500/40 text-blue-600 dark:text-blue-400",
        )}
      >
        {statusLabel}
      </Badge>
    </div>
  );
}
