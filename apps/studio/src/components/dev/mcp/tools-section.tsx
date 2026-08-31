"use client";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from "@wowlab/shared/components/ui/item";

const TOOLS = [
  { key: "toolDecodeLoadout", name: "decode_loadout" },
  { key: "toolGetDocs", name: "get_docs" },
  { key: "toolGetRotation", name: "get_rotation" },
  { key: "toolGetSchema", name: "get_schema" },
  { key: "toolListRotations", name: "list_rotations" },
  { key: "toolListSpellLabels", name: "list_spell_labels" },
  { key: "toolListTables", name: "list_tables" },
  { key: "toolParseSimc", name: "parse_simc" },
  { key: "toolQuery", name: "query" },
  { key: "toolQueryBatch", name: "query_batch" },
  { key: "toolQueryCount", name: "query_count" },
  { key: "toolResolveEffects", name: "resolve_effects" },
] as const;

export function ToolsSection() {
  const content = useIntlayer("mcpPage");

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold tracking-tight">{content.tools}</h2>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {content.toolsDescription}
      </p>
      <ItemGroup>
        {TOOLS.map((tool) => (
          <Item key={tool.name} size="sm" className="gap-1.5">
            <ItemMedia>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 shrink-0"
              >
                {tool.name}
              </Badge>
            </ItemMedia>
            <ItemContent>
              <ItemDescription>{content[tool.key]}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {content.toolsSuffix}
      </p>
    </div>
  );
}
