"use client";

import { type ReactNode } from "react";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

export type ChartTabItem = {
  /** The chart (or any node) shown when this tab is active. */
  chart: ReactNode;
  label: ReactNode;
  value: string;
};

type ChartTabsProps = {
  /** Tab to open initially. Defaults to the first item. */
  defaultValue?: string;

  /** URL query key the active metric tab is persisted under. */
  queryKey: string;
  tabs: ChartTabItem[];
};

/**
 * Switches between several charts that belong to the same category (e.g. a
 * resource level chart and a gain/loss chart). The active tab is persisted in
 * the URL under `queryKey` so a shared link reproduces the selected metric.
 */
export function ChartTabs({
  defaultValue,
  queryKey,
  tabs,
}: Readonly<ChartTabsProps>) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <UrlTabs queryKey={queryKey} defaultValue={defaultValue ?? tabs[0].value}>
      <TabsList variant="line">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.chart}
        </TabsContent>
      ))}
    </UrlTabs>
  );
}
