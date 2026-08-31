import type { Assignee } from "@/lib/github/types";

import { AssigneeLink } from "./assignee-link";

type AssignedUsersProps = {
  assignees: Assignee[];
};

export function AssignedUsers({ assignees }: Readonly<AssignedUsersProps>) {
  if (assignees.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {assignees.map((assignee) => (
        <AssigneeLink key={assignee.id} assignee={assignee} />
      ))}
      <span className="text-xs text-muted-foreground">
        {assignees.map((a) => a.login).join(", ")}
      </span>
    </div>
  );
}
