import { UserIcon } from "lucide-react";

import type { Assignee } from "@/lib/github/types";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@wowlab/shared/components/ui/avatar";

type AssigneeLinkProps = {
  assignee: Assignee;
};

export function AssigneeLink({ assignee }: Readonly<AssigneeLinkProps>) {
  return (
    <a
      href={assignee.html_url}
      target="_blank"
      rel="noopener noreferrer"
      title={`@${assignee.login}`}
      className="no-underline"
    >
      <Avatar className="size-5">
        <AvatarImage src={assignee.avatar_url} alt={assignee.login} />
        <AvatarFallback>
          <UserIcon className="size-3" />
        </AvatarFallback>
      </Avatar>
    </a>
  );
}
