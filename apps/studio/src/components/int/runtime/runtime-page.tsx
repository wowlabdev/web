"use client";

import { useIntlayer } from "next-intlayer";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import { DatabaseTab } from "./database-tab";
import { WorkersTab } from "./workers-tab";

export function RuntimePage() {
  const content = useIntlayer("runtimePage");

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground max-w-2xl text-sm">{content.intro}</p>
      <UrlTabs queryKey="tab" defaultValue="workers">
        <TabsList id="tour-runtime" className="mb-6">
          <TabsTrigger value="workers">{content.tabWorkers}</TabsTrigger>
          <TabsTrigger value="database">{content.tabDatabase}</TabsTrigger>
        </TabsList>

        <TabsContent value="workers">
          <WorkersTab />
        </TabsContent>
        <TabsContent value="database">
          <DatabaseTab />
        </TabsContent>
      </UrlTabs>
    </div>
  );
}
