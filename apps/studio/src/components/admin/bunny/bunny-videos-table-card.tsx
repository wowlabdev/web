"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo, useState } from "react";

import type { BunnyVideo } from "@/lib/query/services";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import {
  FormattedBytes,
  FormattedDate,
  FormattedDuration,
} from "@wowlab/shared/components/common";
import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Input } from "@wowlab/shared/components/ui/input";
import { Link } from "@wowlab/shared/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";
import { env } from "@wowlab/shared/lib/env";

import {
  BUNNY_VIDEO_SEARCH_KEYS,
  bunnyPlayerUrl,
  bunnyStatusLabel,
} from "./utils";

type BunnyVideosTableCardProps = {
  videos: BunnyVideo[] | undefined;
};

export function BunnyVideosTableCard({
  videos,
}: Readonly<BunnyVideosTableCardProps>) {
  const content = useIntlayer("admin");
  const fmtNumber = useNumber();
  const [search, setSearch] = useState("");

  const items = useMemo(() => videos ?? [], [videos]);

  const filtered = useFuzzySearch({
    items,
    keys: BUNNY_VIDEO_SEARCH_KEYS,
    query: search,
  });

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.views += item.views;
        acc.totalWatchTime += item.totalWatchTime;
        acc.storageSize += item.storageSize;

        return acc;
      },
      { storageSize: 0, totalWatchTime: 0, views: 0 },
    );
  }, [items]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle>{content.bunny.videos}</CardTitle>
          <span className="text-muted-foreground text-xs">
            {fmtNumber(items.length, { maximumFractionDigits: 0 })}{" "}
            {content.bunny.videosLower} &middot;{" "}
            {fmtNumber(totals.views, { maximumFractionDigits: 0 })}{" "}
            {content.bunny.totalViewsShort} &middot;{" "}
            <FormattedDuration
              seconds={totals.totalWatchTime}
              format={["hours", "minutes", "seconds"]}
            />{" "}
            {content.bunny.watchedShort} &middot;{" "}
            <FormattedBytes value={totals.storageSize} />
          </span>
        </div>
        <Input
          className="max-w-xs"
          placeholder={content.bunny.search.value}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </CardHeader>
      <CardContent>
        {filtered.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{content.bunny.title}</TableHead>
                <TableHead>{content.bunny.guid}</TableHead>
                <TableHead>{content.bunny.status}</TableHead>
                <TableHead className="text-right">
                  {content.bunny.views}
                </TableHead>
                <TableHead className="text-right">
                  {content.bunny.totalWatch}
                </TableHead>
                <TableHead className="text-right">
                  {content.bunny.avgWatch}
                </TableHead>
                <TableHead className="text-right">
                  {content.bunny.length}
                </TableHead>
                <TableHead className="text-right">
                  {content.bunny.size}
                </TableHead>
                <TableHead>{content.bunny.uploaded}</TableHead>
                <TableHead>{content.bunny.visibility}</TableHead>
                <TableHead>{content.bunny.open}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((video) => (
                <TableRow key={video.guid}>
                  <TableCell>
                    <span className="font-medium text-foreground">
                      {video.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-muted-foreground">
                        {video.guid.slice(0, 8)}
                      </span>
                      <CopyButton value={video.guid} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={video.status === 4 ? "secondary" : "outline"}
                    >
                      {bunnyStatusLabel(video.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {fmtNumber(video.views, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    <FormattedDuration
                      seconds={video.totalWatchTime}
                      format={["hours", "minutes", "seconds"]}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    <FormattedDuration
                      seconds={video.averageWatchTime}
                      format={["hours", "minutes", "seconds"]}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    <FormattedDuration
                      seconds={video.length}
                      format={["hours", "minutes", "seconds"]}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    <FormattedBytes value={video.storageSize} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <FormattedDate
                      value={video.dateUploaded}
                      dateStyle="medium"
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {video.isPublic
                      ? content.bunny.public
                      : content.bunny.private}
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        href={bunnyPlayerUrl(
                          env.BUNNY_STREAM_LIBRARY_ID,
                          video.guid,
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLinkIcon className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-sm">{content.bunny.empty}</p>
        )}
      </CardContent>
    </Card>
  );
}
