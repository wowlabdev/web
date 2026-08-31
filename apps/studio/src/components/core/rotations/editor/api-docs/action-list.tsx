"use client";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@wowlab/shared/components/ui/item";

import type { ApiActionEntry } from "./operator-catalog";

import { buildActionSnippet } from "./snippets";

type ActionListProps = {
  actions: ApiActionEntry[];
  describe: (a: ApiActionEntry) => string;
};

export function ActionList({ actions, describe }: Readonly<ActionListProps>) {
  return (
    <ItemGroup className="gap-1">
      {actions.map((action) => (
        <Item
          key={action.id}
          size="sm"
          className="rounded-md hover:border-border hover:bg-accent"
        >
          <ItemContent>
            <ItemTitle className="font-mono text-sm">{action.id}</ItemTitle>
            <ItemDescription>{describe(action)}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <CopyButton value={buildActionSnippet(action)} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
