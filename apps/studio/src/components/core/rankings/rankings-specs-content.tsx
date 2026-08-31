"use client";

import { TrophyIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useDate, useNumber } from "next-intlayer/format";
import { useMemo, useState } from "react";

import { GameIcon } from "@/components/shared/game";
import { StatGrid } from "@/components/shared/layout";
import { useSpecRankings } from "@/lib/query/services";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@wowlab/shared/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import {
  formatCompactDate,
  formatOptionalDate,
  formatTrend,
  type RankingTableRow,
  UNKNOWN,
} from "./rankings-specs-helpers";
import { RankingsSpecsSkeleton } from "./rankings-specs-skeleton";

export function RankingsSpecsContent() {
  const content = useIntlayer("rankings").specsPage;
  const formatDate = useDate();
  const formatNumber = useNumber();
  const [seasonFilter, setSeasonFilter] = useState("");

  const {
    data: rankings,
    isLoading,
    latestSnapshotAt,
    seasonId: activeSeasonId,
    seasons,
    selectedSeason,
  } = useSpecRankings(seasonFilter);

  const selectedSeasonId = seasonFilter || activeSeasonId || "";

  const sortedRankings = useMemo(
    () =>
      [...rankings].sort((left, right) => {
        if (left.rank !== right.rank) {
          return left.rank - right.rank;
        }

        if (left.score !== right.score) {
          return right.score - left.score;
        }

        return left.spec_id - right.spec_id;
      }),
    [rankings],
  );

  const leaderScore =
    sortedRankings.length > 0 ? Math.round(sortedRankings[0].score) : null;

  const latestUpdate = useMemo(() => {
    let latest: string | null = null;

    for (const row of sortedRankings) {
      if (!latest || row.updated_at > latest) {
        latest = row.updated_at;
      }
    }

    return latest;
  }, [sortedRankings]);

  const tableData = useMemo<RankingTableRow[]>(
    () =>
      sortedRankings.map((row) => ({
        ...row,
        gapFromTop:
          leaderScore === null || row.rank <= 1
            ? UNKNOWN
            : formatNumber(Math.max(0, leaderScore - Math.round(row.score)), {
                maximumFractionDigits: 0,
              }),
        scoreText: formatNumber(Math.round(row.score), {
          maximumFractionDigits: 0,
        }),
        trendText: formatTrend(
          formatNumber,
          content,
          row.rankDelta,
          row.scoreDelta,
        ),
        updatedAtText: formatDate(new Date(row.updated_at), {
          dateStyle: "short",
          timeStyle: "short",
        }),
      })),
    [content, formatDate, formatNumber, leaderScore, sortedRankings],
  );

  if (isLoading) {
    return <RankingsSpecsSkeleton />;
  }

  if (tableData.length === 0) {
    return (
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrophyIcon />
              </EmptyMedia>
              <EmptyTitle>{content.noRankingsTitle.value}</EmptyTitle>
              <EmptyDescription>
                {content.noRankingsDescription.value}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {content.season.value}:{selectedSeasonId || UNKNOWN}
          </Badge>
          <Badge variant="outline">
            {content.latestSnapshot.value}:{" "}
            {formatOptionalDate(formatDate, latestSnapshotAt)}
          </Badge>
          <Badge variant="outline">
            {content.updatedAt.value}:{" "}
            {formatOptionalDate(formatDate, latestUpdate)}
          </Badge>
          {selectedSeason?.is_active ? (
            <Badge>{content.active.value}</Badge>
          ) : (
            <Badge variant="outline">{content.ended.value}</Badge>
          )}
        </div>

        {seasons.length > 0 ? (
          <Select
            value={selectedSeasonId || undefined}
            onValueChange={setSeasonFilter}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder={content.selectSeason.value} />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.season_id} value={season.season_id}>
                  {season.season_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline">{content.noSeasons.value}</Badge>
        )}
      </div>

      <StatGrid>
        {[
          {
            changePercentage: selectedSeasonId || UNKNOWN,
            key: "totalSpecs",
            title: content.totalSpecs.value,
            value: String(tableData.length),
          },
          {
            changePercentage: content.rank.value + " #1",
            key: "score",
            title: content.score.value,
            value: leaderScore === null ? UNKNOWN : formatNumber(leaderScore),
          },
          {
            changePercentage: content.trend.value,
            key: "latestSnapshot",
            title: content.latestSnapshot.value,
            value: formatCompactDate(formatDate, latestSnapshotAt),
          },
        ].map((stat) => (
          <StatCard
            key={stat.key}
            changePercentage={stat.changePercentage}
            icon={<TrophyIcon className="size-4" />}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </StatGrid>

      <TableCard
        title={content.leaderboardTitle.value}
        data={tableData}
        rowKey={(row) => `${row.season_id}:${row.spec_id}`}
        columns={[
          {
            cell: (row) => <Badge variant="outline">#{row.rank}</Badge>,
            className: "w-20",
            header: content.rank.value,
          },
          {
            cell: (row) => (
              <span className="inline-flex items-center gap-2">
                {row.specIcon ? (
                  <GameIcon
                    iconName={row.specIcon}
                    size="sm"
                    alt={row.specName ?? undefined}
                  />
                ) : null}
                <span>{row.specName ?? content.unknownSpec.value}</span>
              </span>
            ),
            header: content.spec.value,
          },
          {
            cell: (row) => row.scoreText,
            className: "text-right",
            header: content.score.value,
          },
          {
            cell: (row) => row.gapFromTop,
            className: "text-right",
            header: content.gapFromTop.value,
          },
          {
            cell: (row) => row.trendText,
            header: content.trend.value,
          },
          {
            cell: (row) => row.updatedAtText,
            header: content.updatedAt.value,
          },
        ]}
      />
    </div>
  );
}
