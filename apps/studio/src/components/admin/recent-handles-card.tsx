"use client";

import { useIntlayer } from "next-intlayer";

import type { useRecentReservedHandles } from "@/lib/query/services";

import { FormattedDate } from "@wowlab/shared/components/common";
import { SkeletonList } from "@wowlab/shared/components/common/skeleton-blocks";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

type RecentHandlesCardProps = {
  isLoading: boolean;
  rows: ReturnType<typeof useRecentReservedHandles>["data"];
};

export function RecentHandlesCard({
  isLoading,
  rows,
}: Readonly<RecentHandlesCardProps>) {
  const content = useIntlayer("admin");

  const renderBody = () => {
    if (isLoading) {
      return <SkeletonList count={3} />;
    }

    if (rows && rows.length > 0) {
      return (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={`${row.handle}-${row.created_at}`}
              className="flex flex-wrap items-center justify-between gap-2 border-b py-2 last:border-b-0"
            >
              <div className="space-x-2">
                <span className="font-medium">{row.handle}</span>
                <Badge variant="outline">{row.reason}</Badge>
              </div>
              <span className="text-muted-foreground text-xs">
                <FormattedDate
                  value={row.created_at}
                  dateStyle="medium"
                  timeStyle="short"
                />
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-muted-foreground text-sm">
        {content.overview.noReservedHandles}
      </p>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.overview.recentReservedHandles}</CardTitle>
      </CardHeader>
      <CardContent>{renderBody()}</CardContent>
    </Card>
  );
}
