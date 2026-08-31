"use client";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: Readonly<ErrorStateProps>) {
  const content = useIntlayer("metricsPage");

  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-6">
        <Badge variant="destructive">{content.errorBadge}</Badge>
        <span className="text-destructive text-sm">{message}</span>
      </CardContent>
    </Card>
  );
}
