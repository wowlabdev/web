"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import type { useShortUrls } from "@/lib/query/services";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { FormattedDate } from "@wowlab/shared/components/common";
import { CopyButton } from "@wowlab/shared/components/common/copy-button";
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

import { buildShortUrlFromSlug, SHORT_URL_SEARCH_KEYS } from "./utils";

type ShortUrlRow = NonNullable<ReturnType<typeof useShortUrls>["data"]>[number];

type ShortUrlsTableCardProps = {
  data: ShortUrlRow[] | undefined;
};

export function ShortUrlsTableCard({
  data,
}: Readonly<ShortUrlsTableCardProps>) {
  const content = useIntlayer("admin");
  const [search, setSearch] = useState("");

  const rowsWithShortUrl = useMemo(() => {
    const rows = data ?? [];

    return rows.map((row) => ({
      ...row,
      short_url: buildShortUrlFromSlug(row.slug),
    }));
  }, [data]);

  const filteredRows = useFuzzySearch({
    items: rowsWithShortUrl,
    keys: SHORT_URL_SEARCH_KEYS,
    query: search,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{content.shortUrls.shortUrls}</CardTitle>
        <Input
          className="max-w-xs"
          placeholder={content.shortUrls.search.value}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </CardHeader>
      <CardContent>
        {filteredRows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{content.shortUrls.shortUrl}</TableHead>
                <TableHead>{content.shortUrls.targetUrl}</TableHead>
                <TableHead>{content.shortUrls.created}</TableHead>
                <TableHead>{content.shortUrls.open}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.slug}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{row.slug}</span>
                      <CopyButton value={row.short_url} />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <a
                      href={row.target_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {row.target_url}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <FormattedDate
                      value={row.created_at}
                      dateStyle="medium"
                      timeStyle="short"
                    />
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        href={row.target_url}
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
          <p className="text-muted-foreground text-sm">
            {content.shortUrls.empty}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
