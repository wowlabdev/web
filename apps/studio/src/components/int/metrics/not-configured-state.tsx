"use client";

import { useIntlayer } from "next-intlayer";

import { Card, CardContent } from "@wowlab/shared/components/ui/card";

type NotConfiguredStateProps = {
  service: string;
};

export function NotConfiguredState({
  service,
}: Readonly<NotConfiguredStateProps>) {
  const content = useIntlayer("metricsPage");

  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <p className="text-muted-foreground text-sm">
          {service} {content.notAvailable}
        </p>
        <p className="text-muted-foreground/70 text-xs">{content.envHint}</p>
      </CardContent>
    </Card>
  );
}
