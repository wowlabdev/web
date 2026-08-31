"use client";

import { useIntlayer } from "next-intlayer";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import { BeaconTab } from "./beacon-tab";
import { SentinelTab } from "./sentinel-tab";

export function MetricsPage() {
  const content = useIntlayer("metricsPage");

  return (
    <div className="space-y-6">
      <UrlTabs queryKey="tab" defaultValue="beacon">
        <TabsList className="mb-6">
          <TabsTrigger value="beacon">{content.tabBeacon}</TabsTrigger>
          <TabsTrigger value="sentinel">{content.tabSentinel}</TabsTrigger>
        </TabsList>

        <TabsContent value="beacon">
          <BeaconTab />
        </TabsContent>
        <TabsContent value="sentinel">
          <SentinelTab />
        </TabsContent>
      </UrlTabs>
    </div>
  );
}
