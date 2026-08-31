import type { ReactNode } from "react";

import { ExternalLinkIcon, FileCodeIcon } from "lucide-react";

import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";

type MdGithubEmbedProps = {
  children?: ReactNode;
  facts?: string;
  permalink: string;
};

const SOURCE_RE = /\/blob\/[^/]+\/(.+?)#L(\d+)-L(\d+)$/;

export function MdGithubEmbed({
  children,
  facts,
  permalink,
}: Readonly<MdGithubEmbedProps>) {
  const { path, range } = parseSource(permalink);

  return (
    <Card className="not-prose my-6">
      <CardHeader className="flex flex-row items-center gap-2 border-b bg-muted/30">
        <FileCodeIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <Link
          href={permalink}
          rel="noreferrer"
          target="_blank"
          className="group/src inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary"
        >
          <span className="truncate font-mono">{path}</span>
          {range ? (
            <span className="shrink-0 text-muted-foreground">{range}</span>
          ) : null}
          <ExternalLinkIcon className="size-3 shrink-0 text-muted-foreground transition-colors group-hover/src:text-primary" />
        </Link>
        {facts ? (
          <Badge variant="secondary" className="ml-auto shrink-0">
            {facts}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="[&_pre]:my-0">{children}</CardContent>
    </Card>
  );
}

function parseSource(permalink: string): {
  path: string;
  range: null | string;
} {
  const match = SOURCE_RE.exec(permalink);

  if (match == null) {
    return { path: permalink, range: null };
  }

  const [, path, start, end] = match;
  const range = end === start ? `L${start}` : `L${start}-L${end}`;

  return { path, range };
}
