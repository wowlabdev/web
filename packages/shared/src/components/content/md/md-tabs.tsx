"use client";

import type { ReactNode } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

type MdTabContentProps = {
  children: ReactNode;
  value: string;
};

type MdTabListProps = {
  children: ReactNode;
};

type MdTabsProps = {
  children: ReactNode;
  defaultValue?: string;
};

type MdTabTriggerProps = {
  children: ReactNode;
  value: string;
};

export function MdTabContent({ children, value }: Readonly<MdTabContentProps>) {
  return <TabsContent value={value}>{children}</TabsContent>;
}

export function MdTabList({ children }: Readonly<MdTabListProps>) {
  return <TabsList>{children}</TabsList>;
}

export function MdTabs({ children, defaultValue }: Readonly<MdTabsProps>) {
  return (
    <Tabs defaultValue={defaultValue} className="my-6">
      {children}
    </Tabs>
  );
}

export function MdTabTrigger({ children, value }: Readonly<MdTabTriggerProps>) {
  return <TabsTrigger value={value}>{children}</TabsTrigger>;
}
