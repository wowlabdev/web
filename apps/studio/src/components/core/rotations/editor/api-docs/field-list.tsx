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

import type { FieldDescriptorInfo } from "../types";

import { buildFieldSnippet } from "./snippets";
type FieldListProps = {
  descriptors: FieldDescriptorInfo[];
  exampleKeysFor: (d: FieldDescriptorInfo) => string[];
};

export function FieldList({
  descriptors,
  exampleKeysFor,
}: Readonly<FieldListProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <ItemGroup className="gap-1">
      {descriptors.map((d) => {
        const keys = exampleKeysFor(d);
        const overflow = keys.length > 5 ? keys.length - 5 : 0;

        return (
          <Item
            key={`${d.domain}.${d.name}.${d.id}`}
            size="sm"
            className="rounded-md hover:border-border hover:bg-accent"
          >
            <ItemContent>
              <ItemTitle className="font-mono text-sm">
                {d.domain}.{d.name}
                <Badge variant="outline">{d.field_type}</Badge>
              </ItemTitle>
              <ItemDescription>{d.description}</ItemDescription>
              {d.slot_kind === "keyed" && keys.length > 0 && (
                <ItemDescription className="text-[10px]">
                  {content.apiKeysLabel}:{keys.slice(0, 5).join(", ")}
                  {overflow > 0 && (
                    <>
                      {" · "}
                      {content.apiKeysMore(overflow)}
                    </>
                  )}
                </ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <CopyButton value={buildFieldSnippet(d)} />
            </ItemActions>
          </Item>
        );
      })}
    </ItemGroup>
  );
}
