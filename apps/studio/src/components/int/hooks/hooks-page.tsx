"use client";

import { Boxes, Database, Server } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { QueryIsland } from "@/components/shared/islands/query-island";
import { UrlTabs } from "@/components/shared/ui/url-tabs";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import { FilterBar } from "./filter-bar";
import { HOOK_REGISTRY } from "./hook-registry";
import { HookSection } from "./hook-section";

export function HooksPage() {
  return (
    <QueryIsland>
      <HooksContent />
    </QueryIsland>
  );
}

function HooksContent() {
  const content = useIntlayer("hooksPage");
  const [filter, setFilter] = useState("");

  const gameDataCount = HOOK_REGISTRY.filter(
    (entry) => entry.source === "game-data",
  ).length;
  const serverCount = HOOK_REGISTRY.length - gameDataCount;

  const stats = [
    {
      icon: <Boxes className="size-4" />,
      key: "total",
      title: content.titleHooks.value,
      value: String(HOOK_REGISTRY.length),
    },
    {
      icon: <Database className="size-4" />,
      key: "game-data",
      title: content.titleGameData.value,
      value: String(gameDataCount),
    },
    {
      icon: <Server className="size-4" />,
      key: "server",
      title: content.titleServer.value,
      value: String(serverCount),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            value={stat.value}
            title={stat.title}
            changePercentage={content.registryCaption.value}
          />
        ))}
      </div>

      <FilterBar value={filter} onChange={setFilter} />

      <UrlTabs queryKey="tab" defaultValue="single">
        <TabsList variant="line">
          <TabsTrigger value="single">{content.tabSingle}</TabsTrigger>
          <TabsTrigger value="list">{content.tabLists}</TabsTrigger>
          <TabsTrigger value="global">{content.tabGlobal}</TabsTrigger>
          <TabsTrigger value="search">{content.tabSearch}</TabsTrigger>
          <TabsTrigger value="derived">{content.tabDerived}</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4 pt-4">
          <HookSection kind="single" filter={filter} />
        </TabsContent>
        <TabsContent value="list" className="space-y-4 pt-4">
          <HookSection kind="list" filter={filter} />
        </TabsContent>
        <TabsContent value="global" className="space-y-4 pt-4">
          <HookSection kind="global" filter={filter} />
        </TabsContent>
        <TabsContent value="search" className="space-y-4 pt-4">
          <HookSection kind="search" filter={filter} />
        </TabsContent>
        <TabsContent value="derived" className="space-y-4 pt-4">
          <HookSection kind="derived" filter={filter} />
        </TabsContent>
      </UrlTabs>
    </div>
  );
}
