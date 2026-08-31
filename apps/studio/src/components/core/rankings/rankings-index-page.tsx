"use client";

import { ArrowRightIcon, BoxesIcon, TrophyIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

export function RankingsIndexPage() {
  const content = useIntlayer("rankings");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrophyIcon className="size-4" />
            {routes.rankings.specs.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {content.index.specsDescription.value}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={href(routes.rankings.specs)}>
              {content.index.viewSpecs.value}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BoxesIcon className="size-4" />
            {routes.rankings.items.label}
            <Badge variant="outline">{content.itemsPage.planned.value}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {content.index.itemsDescription.value}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={href(routes.rankings.items)}>
              {content.index.viewItems.value}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
