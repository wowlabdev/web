"use client";

import { MilestoneIcon, SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import type { Issue, Milestone } from "@/lib/github/types";

import { useRoadmap } from "@/lib/query/services/roadmap";
import { SkeletonText } from "@wowlab/shared/components/common/skeleton-blocks";
import { Alert, AlertDescription } from "@wowlab/shared/components/ui/alert";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Input } from "@wowlab/shared/components/ui/input";

import { MilestoneSection } from "./roadmap/milestone-section";
import { UnmilestonedSection } from "./roadmap/unmilestoned-section";

export function MdRoadmap() {
  const { roadmap: content } = useIntlayer("article");
  const { data, error, isLoading } = useRoadmap();
  const [inputValue, setInputValue] = useState("");

  const filteredIssues = useMemo(() => {
    const issues = data?.issues ?? [];

    if (!inputValue.trim()) {
      return issues;
    }

    const query = inputValue.toLowerCase();

    return issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(query) ||
        issue.body?.toLowerCase().includes(query) ||
        issue.milestone?.title.toLowerCase().includes(query) ||
        issue.milestone?.description?.toLowerCase().includes(query) ||
        issue.labels.some((label) =>
          typeof label === "string"
            ? label.toLowerCase().includes(query)
            : label.name?.toLowerCase().includes(query),
        ),
    );
  }, [data?.issues, inputValue]);

  const { milestonedGroups, unmilestonedIssues } = useMemo(() => {
    if (!data) {
      return { milestonedGroups: [], unmilestonedIssues: [] };
    }

    const milestoneMap = new Map<
      number,
      { issues: Issue[]; milestone: Milestone }
    >();

    for (const m of data.milestones) {
      milestoneMap.set(m.number, { issues: [], milestone: m });
    }

    const unmilestoned: Issue[] = [];

    for (const issue of filteredIssues) {
      if (!issue.milestone) {
        unmilestoned.push(issue);
        continue;
      }

      const group = milestoneMap.get(issue.milestone.number);

      if (!group) {
        unmilestoned.push(issue);
        continue;
      }

      group.issues.push(issue);
    }

    const groups = [...milestoneMap.values()].filter(
      (g) => g.issues.length > 0 || !inputValue,
    );

    return { milestonedGroups: groups, unmilestonedIssues: unmilestoned };
  }, [filteredIssues, inputValue, data]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading && !data) {
    return (
      <Card>
        <CardContent className="py-6">
          <SkeletonText
            className="space-y-3"
            widths={["w-48", "w-full", "w-3/4"]}
          />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{content.loadFailed}</AlertDescription>
      </Alert>
    );
  }

  if (data.issues.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
        <MilestoneIcon className="size-10" />
        <div>
          <p className="font-medium">{content.emptyTitle}</p>
          <p className="text-sm">{content.emptyDescription}</p>
        </div>
      </div>
    );
  }

  const openCount = data.issues.filter((i) => i.state === "open").length;
  const closedCount = data.issues.filter((i) => i.state === "closed").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {content.openCount({ count: openCount })}
          </Badge>
          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            {content.closedCount({ count: closedCount })}
          </Badge>
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
          <div className="relative w-full max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={content.searchPlaceholder.value}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {milestonedGroups.map(({ issues, milestone }) => (
        <MilestoneSection
          key={milestone.id}
          milestone={milestone}
          issues={issues}
        />
      ))}

      <UnmilestonedSection issues={unmilestonedIssues} />

      {filteredIssues.length === 0 && inputValue && (
        <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
          <SearchIcon className="size-10" />
          <div>
            <p className="font-medium">{content.noMatchesTitle}</p>
            <p className="text-sm">{content.noMatchesDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
}
