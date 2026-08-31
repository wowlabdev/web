"use client";

import { useIntlayer } from "next-intlayer";

import { useBunnyVideos } from "@/lib/query/services";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";

import { BunnyVideosTableCard } from "./bunny-videos-table-card";

export function BunnyPage() {
  const content = useIntlayer("admin");
  const videos = useBunnyVideos();

  return (
    <div className="space-y-6">
      {videos.error && (
        <Alert variant="destructive">
          <AlertTitle>{content.bunny.requestFailed}</AlertTitle>
          <AlertDescription>{videos.error.message}</AlertDescription>
        </Alert>
      )}

      <BunnyVideosTableCard videos={videos.data} />
    </div>
  );
}
