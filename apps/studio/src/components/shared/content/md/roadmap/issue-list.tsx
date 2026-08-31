import type { Issue } from "@/lib/github/types";

import { CardContent } from "@wowlab/shared/components/ui/card";

import { IssueRow } from "./issue-row";

type IssueListProps = {
  issues: Issue[];
};

export function IssueList({ issues }: Readonly<IssueListProps>) {
  return (
    <CardContent>
      <div className="flex flex-col divide-y divide-border">
        {issues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))}
      </div>
    </CardContent>
  );
}
