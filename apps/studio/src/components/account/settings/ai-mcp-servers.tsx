"use client";

import { Trash2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { McpServerInput } from "@/lib/ai/mcp-server";

import {
  useAiMcpServers,
  useUpdateAiMcpServers,
} from "@/lib/query/services/auth";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@wowlab/shared/components/ui/item";

import { AiMcpAddServer } from "./ai-mcp-add-server";

export function AiMcpServers() {
  const content = useIntlayer("aiMcp");
  const { data: servers = [], isLoading } = useAiMcpServers();
  const update = useUpdateAiMcpServers();

  const onAdd = (server: McpServerInput) =>
    update.mutateAsync({
      servers: [...servers, { id: crypto.randomUUID(), ...server }],
    });

  const onRemove = (id: string) =>
    update.mutateAsync({ servers: servers.filter((s) => s.id !== id) });

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>{content.wowlabLabel}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">{content.wowlabConnectedNote}</Badge>
          </ItemActions>
        </Item>

        {servers.length === 0 ? (
          <p className="text-muted-foreground text-sm">{content.empty}</p>
        ) : (
          servers.map((server) => (
            <Item key={server.id} variant="outline">
              <ItemContent>
                <ItemTitle>{server.label}</ItemTitle>
                <ItemDescription>{server.url}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={update.isPending}
                  onClick={() => void onRemove(server.id)}
                >
                  <Trash2Icon className="size-4" />
                  <span className="sr-only">{content.removeAriaLabel}</span>
                </Button>
              </ItemActions>
            </Item>
          ))
        )}
      </div>

      <AiMcpAddServer isPending={update.isPending} onAdd={onAdd} />
    </div>
  );
}
