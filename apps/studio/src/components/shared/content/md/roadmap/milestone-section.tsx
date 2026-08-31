"use client";

import { CalendarIcon, MilestoneIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { Issue, Milestone } from "@/lib/github/types";

import { FormattedDate } from "@wowlab/shared/components/common";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import { IssueList } from "./issue-list";
import { MilestoneProgress } from "./milestone-progress";
import { SortPopover } from "./sort-popover";
import { useSortedIssues } from "./use-sorted-issues";

type MilestoneSectionProps = {
  issues: Issue[];
  milestone: Milestone;
};

export function MilestoneSection({
  issues,
  milestone,
}: Readonly<MilestoneSectionProps>) {
  const { roadmap: content } = useIntlayer("article");
  const { setSortMode, sortedIssues, sortMode } = useSortedIssues(issues);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MilestoneIcon className="size-5 shrink-0 text-primary" />
              <CardTitle className="m-0 leading-tight">
                <a
                  href={milestone.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:underline"
                >
                  {milestone.title}
                </a>
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {milestone.due_on && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {content.due}{" "}
                    <FormattedDate
                      value={milestone.due_on}
                      day="numeric"
                      month="short"
                      year="numeric"
                    />
                  </span>
                </div>
              )}
              <SortPopover sortMode={sortMode} onChange={setSortMode} />
            </div>
          </div>
          {milestone.description && (
            <CardDescription>{milestone.description}</CardDescription>
          )}
          <MilestoneProgress
            open={milestone.open_issues}
            closed={milestone.closed_issues}
          />
        </div>
      </CardHeader>
      {issues.length > 0 && <IssueList issues={sortedIssues} />}
    </Card>
  );
}
