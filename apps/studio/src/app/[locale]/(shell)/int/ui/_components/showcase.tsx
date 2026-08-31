"use client";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import {
  ActionsSection,
  DataDisplaySection,
  FeedbackSection,
  FormsSection,
  GameSection,
  NavigationSection,
  OverlaysSection,
  SpinnersSection,
  TypographySection,
  VisualizationSection,
} from "./sections";

const tabs = [
  { component: TypographySection, id: "typography", label: "Typography" },
  { component: ActionsSection, id: "actions", label: "Button" },
  { component: DataDisplaySection, id: "data-display", label: "Data Display" },
  { component: FormsSection, id: "forms", label: "Forms" },
  { component: NavigationSection, id: "navigation", label: "Navigation" },
  { component: OverlaysSection, id: "overlays", label: "Overlays" },
  { component: FeedbackSection, id: "feedback", label: "Feedback" },
  { component: SpinnersSection, id: "spinners", label: "Spinners" },
  { component: VisualizationSection, id: "visualization", label: "Charts" },
  { component: GameSection, id: "game", label: "Game" },
];

export function Showcase() {
  return (
    <div className="space-y-6">
      <UrlTabs queryKey="section" defaultValue="typography">
        <TabsList variant="line">
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.id} value={t.id} className="space-y-8 pt-6">
            <t.component />
          </TabsContent>
        ))}
      </UrlTabs>
    </div>
  );
}
