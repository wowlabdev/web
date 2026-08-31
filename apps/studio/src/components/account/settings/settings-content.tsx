"use client";

import { useIntlayer } from "next-intlayer";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import { useUserAccount } from "@/lib/query/services/user";
import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";
import { Separator } from "@wowlab/shared/components/ui/separator";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import { AiMcpServers } from "./ai-mcp-servers";
import { AiSettings } from "./ai-settings";
import { ConnectionsList } from "./connections-list";
import { SettingsDangerZone } from "./settings-danger-zone";
import { SettingsSection } from "./settings-section";

export function SettingsContent() {
  const { user } = useUserAccount();
  const content = useIntlayer("accountPage");
  const ai = useIntlayer("aiSettings");
  const aiMcp = useIntlayer("aiMcp");

  const profileFields = [
    { id: "email", label: content.settingsFieldEmail, value: user.email },
    { id: "handle", label: content.settingsFieldHandle, value: user.handle },
    { id: "name", label: content.settingsFieldDisplayName, value: user.name },
  ];

  return (
    <section className="py-3">
      <UrlTabs
        className="mx-auto max-w-5xl gap-10"
        defaultValue="basic"
        queryKey="tab"
      >
        <TabsList variant="line">
          <TabsTrigger value="basic">{content.settingsTabBasic}</TabsTrigger>
          <TabsTrigger value="advanced">
            {content.settingsTabAdvanced}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-10">
          <SettingsSection
            description={content.settingsProfileDescription}
            title={content.settingsProfileTitle}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {profileFields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <Label>{field.label}</Label>
                  <Input value={field.value || ""} disabled readOnly />
                </div>
              ))}
            </div>
          </SettingsSection>

          <Separator />

          <SettingsSection
            description={content.settingsConnectionsDescription}
            title={content.settingsConnectionsTitle}
          >
            <ConnectionsList />
          </SettingsSection>

          <Separator />

          <SettingsSection
            description={content.settingsDangerDescription}
            title={content.settingsDangerTitle}
          >
            <SettingsDangerZone />
          </SettingsSection>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-10">
          <SettingsSection
            description={ai.sectionDescription}
            title={ai.sectionTitle}
          >
            <AiSettings />
          </SettingsSection>

          <Separator />

          <SettingsSection
            description={aiMcp.sectionDescription}
            title={aiMcp.sectionTitle}
          >
            <AiMcpServers />
          </SettingsSection>
        </TabsContent>
      </UrlTabs>
    </section>
  );
}
