"use client";

import { ExternalLinkIcon, PackageIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  AddonPreviewExpanded,
  AddonPreviewScope,
} from "@wowlab/shared/components/addon";
import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { CurseForgeIcon } from "@wowlab/shared/lib/icons";
import {
  makeAddonDownloadUrl,
  makeAddonInstallUrl,
} from "@wowlab/shared/lib/links";

import { AddonCommandTable } from "./addon";

export function AddonPage() {
  const content = useIntlayer("addonPage");

  const features = [
    { description: content.lootRollDescription, title: content.lootRollTitle },
    { description: content.equipDescription, title: content.equipTitle },
    { description: content.exportDescription, title: content.exportTitle },
  ];

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-primary/40 bg-gradient-to-br from-primary/15 via-card to-card shadow-none">
        <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <PackageIcon className="size-7 text-primary" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-base font-semibold tracking-tight">
              {content.badge}
            </p>
            <p className="text-xs text-muted-foreground">
              {content.downloadSource}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild className="w-full sm:w-auto" size="lg">
              <a href={makeAddonInstallUrl()} rel="noreferrer">
                <CurseForgeIcon className="size-4" />
                {content.installLabel}
              </a>
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto"
              size="lg"
              variant="outline"
            >
              <a href={makeAddonDownloadUrl()} rel="noreferrer" target="_blank">
                <ExternalLinkIcon />
                {content.downloadLabel}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddonPreviewScope>
        <Card className="overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            <AddonPreviewExpanded />
          </CardContent>
        </Card>
      </AddonPreviewScope>

      <section className="grid gap-3 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title.value} className="shadow-none">
            <CardContent className="space-y-1 p-4">
              <h3 className="text-sm font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <AddonCommandTable />
    </div>
  );
}
