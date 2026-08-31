"use client";

import { useIntlayer } from "next-intlayer";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@wowlab/shared/components/ui/item";

import type { ApiOperatorEntry } from "./operator-catalog";

import { OPERATOR_GROUP_KEY } from "./descriptions";
import { buildOperatorSnippet } from "./snippets";

type OperatorListProps = {
  describe: (op: ApiOperatorEntry) => string;
  operators: ApiOperatorEntry[];
};

export function OperatorList({
  describe,
  operators,
}: Readonly<OperatorListProps>) {
  const content = useIntlayer("rotationEditor");
  const groups = new Map<ApiOperatorEntry["group"], ApiOperatorEntry[]>();

  for (const op of operators) {
    const arr = groups.get(op.group) ?? [];

    arr.push(op);
    groups.set(op.group, arr);
  }

  return (
    <div className="space-y-3">
      {[...groups.entries()].map(([group, ops]) => (
        <div key={group} className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {content[OPERATOR_GROUP_KEY[group]].value}
          </p>
          <ItemGroup className="gap-1">
            {ops.map((op) => (
              <Item
                key={op.id}
                size="sm"
                className="rounded-md hover:border-border hover:bg-accent"
              >
                <ItemContent>
                  <ItemTitle className="font-mono text-sm">
                    {op.symbol}
                    <Badge variant="outline">{op.id}</Badge>
                  </ItemTitle>
                  <ItemDescription>{describe(op)}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <CopyButton value={buildOperatorSnippet(op)} />
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </div>
      ))}
    </div>
  );
}
