"use client";

import type { SpecIntrospection } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Separator } from "@wowlab/shared/components/ui/separator";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import { AurasTable } from "./auras-table";
import { HeroTalentsSection } from "./hero-talents-section";
import { SpellsTable } from "./spells-table";
import { TalentsTable } from "./talents-table";

type SpecDetailsProps = {
  engine: typeof import("wowlab-engine");
  specId: number;
};

export function SpecDetails({ engine, specId }: Readonly<SpecDetailsProps>) {
  const content = useIntlayer("enginePage");
  const introspection = useMemo(
    () => engine.getSpecIntrospection(specId) as SpecIntrospection,
    [engine, specId],
  );

  const resource = introspection.resource_primary;
  const talentCount = introspection.spells.length + introspection.auras.length;

  return (
    <div className="pt-2">
      <Separator className="mb-4" />

      <div className="mb-4 flex items-center gap-4 text-sm">
        <Badge variant="outline">{resource.name}</Badge>
        <span className="text-muted-foreground">
          {content.resourceStats({
            max: resource.max,
            regen: resource.regen,
            start: resource.starts_at,
          })}
        </span>
      </div>

      <UrlTabs queryKey="detail" defaultValue="spells">
        <TabsList variant="line">
          <TabsTrigger value="spells">
            {content.tabSpellsCount({ count: introspection.spells.length })}
          </TabsTrigger>
          <TabsTrigger value="auras">
            {content.tabAurasCount({ count: introspection.auras.length })}
          </TabsTrigger>
          <TabsTrigger value="talents">
            {content.tabTalentsCount({ count: talentCount })}
          </TabsTrigger>
          <TabsTrigger value="hero">
            {content.tabHeroCount({
              count: introspection.hero_talents.length,
            })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spells">
          <SpellsTable
            spells={introspection.spells}
            resourceName={resource.name}
          />
        </TabsContent>

        <TabsContent value="auras">
          <AurasTable auras={introspection.auras} />
        </TabsContent>

        <TabsContent value="talents">
          <TalentsTable
            spells={introspection.spells}
            auras={introspection.auras}
          />
        </TabsContent>

        <TabsContent value="hero">
          <HeroTalentsSection trees={introspection.hero_talents} />
        </TabsContent>
      </UrlTabs>
    </div>
  );
}
