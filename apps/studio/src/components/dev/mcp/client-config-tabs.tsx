"use client";

import { useIntlayer } from "next-intlayer";

import type { ClientConfig } from "@/lib/mcp/client-configs";

import { CodeBlock } from "@/components/dev";
import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

export function ClientConfigTabs({
  clients,
}: Readonly<{ clients: ClientConfig[] }>) {
  const content = useIntlayer("mcpPage");

  return (
    <UrlTabs queryKey="client" defaultValue={clients[0]?.label ?? "Claude"}>
      <TabsList variant="line" className="flex-wrap">
        {clients.map((c) => (
          <TabsTrigger key={c.label} value={c.label}>
            <c.icon className="size-3.5" />
            <span>{c.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {clients.map((c) => (
        <TabsContent key={c.label} value={c.label} className="space-y-3 pt-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {c.path}
            </p>
            <CodeBlock copyValue={c.config}>{c.configDisplay}</CodeBlock>
          </div>
          {c.cliDisplay && c.cli && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {content.cli}
              </p>
              <CodeBlock copyValue={c.cli}>{c.cliDisplay}</CodeBlock>
            </div>
          )}
        </TabsContent>
      ))}
    </UrlTabs>
  );
}
