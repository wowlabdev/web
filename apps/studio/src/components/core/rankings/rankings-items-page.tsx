"use client";

import { BoxesIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  Skeleton,
  SkeletonCard,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

export function RankingsItemsPage() {
  const content = useIntlayer("rankings").itemsPage;

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <BoxesIcon className="size-8 text-muted-foreground" />
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            {content.noItemDataTitle.value}
          </h2>
          <p className="text-muted-foreground text-sm">
            {content.noItemDataDescription.value}
          </p>
        </div>
        <Badge variant="outline">{content.planned.value}</Badge>
        <Link
          href={href(routes.rankings.specs)}
          className="text-sm underline-offset-4 hover:underline"
        >
          {content.viewSpecRankings.value}
        </Link>
      </CardContent>
    </Card>
  );
}

export function RankingsItemsSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <Skeleton className="size-8 rounded-md" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    </SkeletonCard>
  );
}
