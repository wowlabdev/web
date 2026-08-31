"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import { CodeBlock } from "@/components/dev/code-block";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";

import type { HookEntry } from "./hook-registry-types";

export function HookDemoCard({
  children,
  entry,
}: Readonly<{ children: ReactNode; entry: HookEntry }>) {
  const content = useIntlayer("hooksPage");
  const importLine = `import { ${entry.name} } from "${entry.importPath}";`;
  const sourceLabel =
    entry.source === "game-data"
      ? content.sourceGameData
      : content.sourceServer;

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-sm font-semibold">{entry.name}</code>
          <Badge variant="outline">
            {`${entry.returns}<${entry.returnType}>`}
          </Badge>
          <Badge variant="secondary">{sourceLabel}</Badge>
        </div>
        <p className="text-muted-foreground font-mono text-xs">
          {entry.signature}
        </p>
        <CodeBlock copyValue={importLine}>{importLine}</CodeBlock>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
