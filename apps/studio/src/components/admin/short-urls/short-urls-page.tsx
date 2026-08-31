"use client";

import { useIntlayer } from "next-intlayer";

import { useGenerateShortUrl, useShortUrls } from "@/lib/query/services";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";

import { GenerateCard } from "./generate-card";
import { ShortUrlsTableCard } from "./short-urls-table-card";

export function ShortUrlsPage() {
  const content = useIntlayer("admin");
  const shortUrlMutation = useGenerateShortUrl();
  const shortUrlsQuery = useShortUrls();

  return (
    <div className="space-y-6">
      {(shortUrlMutation.error || shortUrlsQuery.error) && (
        <Alert variant="destructive">
          <AlertTitle>{content.shortUrls.requestFailed}</AlertTitle>
          <AlertDescription>
            {(shortUrlMutation.error ?? shortUrlsQuery.error)?.message}
          </AlertDescription>
        </Alert>
      )}

      <GenerateCard mutation={shortUrlMutation} />

      <ShortUrlsTableCard data={shortUrlsQuery.data} />
    </div>
  );
}
