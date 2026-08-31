"use client";

import { useIntlayer } from "next-intlayer";

import type { useSeasons } from "@/lib/query/services";

import { FormattedDate } from "@wowlab/shared/components/common";
import { SkeletonTable } from "@wowlab/shared/components/common/skeleton-blocks";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

type SeasonRow = NonNullable<ReturnType<typeof useSeasons>["data"]>[number];

type SeasonsTableCardProps = {
  data: SeasonRow[] | undefined;
  isLoading: boolean;
};

export function SeasonsTableCard({
  data,
  isLoading,
}: Readonly<SeasonsTableCardProps>) {
  const content = useIntlayer("admin");

  const renderBody = () => {
    if (isLoading) {
      return (
        <SkeletonTable
          cols={["w-16", "w-12", "w-24", "w-24", "w-16", "w-24"]}
        />
      );
    }

    if (data && data.length > 0) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{content.seasons.seasonId}</TableHead>
              <TableHead>{content.seasons.ruleset}</TableHead>
              <TableHead>{content.seasons.starts}</TableHead>
              <TableHead>{content.seasons.ends}</TableHead>
              <TableHead>{content.seasons.status}</TableHead>
              <TableHead>{content.seasons.created}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((season) => (
              <TableRow key={season.season_id}>
                <TableCell className="font-medium">
                  {season.season_id}
                </TableCell>
                <TableCell>v{season.ruleset_version}</TableCell>
                <TableCell className="text-muted-foreground">
                  <FormattedDate value={season.starts_at} dateStyle="medium" />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {season.ends_at ? (
                    <FormattedDate value={season.ends_at} dateStyle="medium" />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {season.is_active ? (
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      {content.seasons.active}
                    </Badge>
                  ) : (
                    <Badge variant="outline">{content.seasons.ended}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <FormattedDate value={season.created_at} dateStyle="medium" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    return (
      <p className="text-muted-foreground text-sm">
        {content.seasons.noSeasons}
      </p>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.seasons.seasons}</CardTitle>
      </CardHeader>
      <CardContent>{renderBody()}</CardContent>
    </Card>
  );
}
