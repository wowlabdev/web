"use client";

import { useIntlayer } from "next-intlayer";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import type {
  SettingGroup,
  SettingSection,
  SettingValue,
} from "./setting-types";

import { SettingField } from "./setting-field";
type SettingsPanelProps = {
  groupedSettings: SettingGroup[];
  onSettingChange: (key: string, value: SettingValue) => void;
  onSettingReset: (key: string) => void;
  settings: Record<string, SettingValue>;
};
type SettingsSectionProps = {
  onSettingChange: (key: string, value: SettingValue) => void;
  onSettingReset: (key: string) => void;
  section: SettingSection;
  settings: Record<string, SettingValue>;
};

export function SettingsPanel({
  groupedSettings,
  onSettingChange,
  onSettingReset,
  settings,
}: Readonly<SettingsPanelProps>) {
  const content = useIntlayer("simulatorPage");

  if (groupedSettings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{content.noSettings}</p>
    );
  }

  const defaultTab = groupedSettings[0].group;

  return (
    <UrlTabs queryKey="settings" defaultValue={defaultTab}>
      <TabsList>
        {groupedSettings.map((group) => (
          <TabsTrigger key={group.group} value={group.group}>
            {group.group}
          </TabsTrigger>
        ))}
      </TabsList>

      {groupedSettings.map((group) => (
        <TabsContent key={group.group} value={group.group}>
          <div className="flex flex-col gap-4">
            {group.sections.map((section) => (
              <SettingsSection
                key={section.section}
                section={section}
                settings={settings}
                onSettingChange={onSettingChange}
                onSettingReset={onSettingReset}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </UrlTabs>
  );
}

function SettingsSection({
  onSettingChange,
  onSettingReset,
  section,
  settings,
}: Readonly<SettingsSectionProps>) {
  const content = useIntlayer("simulatorPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.section}</CardTitle>
        <CardDescription>
          {content.settingsCount(section.items.length)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {section.items.map((item) => (
            <SettingField
              key={item.key}
              setting={item}
              value={settings[item.key]}
              onChange={(value) => onSettingChange(item.key, value)}
              onReset={() => onSettingReset(item.key)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
