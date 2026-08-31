"use client";

import { Castle, Shield } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import type { JournalTab } from "./types";

type JournalTabsProps = {
  onChange: (value: JournalTab) => void;
  value: JournalTab;
};

export function JournalTabs({ onChange, value }: Readonly<JournalTabsProps>) {
  const content = useIntlayer("journalPage");

  return (
    <UrlTabs
      value={value}
      onValueChange={(next) => onChange(next as JournalTab)}
    >
      <TabsList variant="line">
        <TabsTrigger value="raids">
          <Castle className="size-4" />
          {content.tabRaids}
        </TabsTrigger>
        <TabsTrigger value="dungeons">
          <Shield className="size-4" />
          {content.tabDungeons}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="raids" />
      <TabsContent value="dungeons" />
    </UrlTabs>
  );
}
