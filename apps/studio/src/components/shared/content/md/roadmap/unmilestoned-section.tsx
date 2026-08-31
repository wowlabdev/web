"use client";

import { CircleDotIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { Issue } from "@/lib/github/types";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import { IssueList } from "./issue-list";
import { SortPopover } from "./sort-popover";
import { useSortedIssues } from "./use-sorted-issues";

type UnmilestonedSectionProps = {
  issues: Issue[];
};

export function UnmilestonedSection({
  issues,
}: Readonly<UnmilestonedSectionProps>) {
  const { roadmap: content } = useIntlayer("article");
  const { setSortMode, sortedIssues, sortMode } = useSortedIssues(issues);

  if (issues.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CircleDotIcon className="size-5 shrink-0 text-muted-foreground" />
            <CardTitle className="m-0 leading-tight">
              {content.unscheduled}
            </CardTitle>
          </div>
          <SortPopover sortMode={sortMode} onChange={setSortMode} />
        </div>
        <CardDescription>{content.unscheduledDescription}</CardDescription>
      </CardHeader>
      <IssueList issues={sortedIssues} />
    </Card>
  );
}
