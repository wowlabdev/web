import type { BunnyVideoStatus } from "@/lib/query/services";

export const BUNNY_VIDEO_SEARCH_KEYS = [
  "title",
  "guid",
  "category",
  "collectionId",
] as const;

const STATUS_LABEL: Record<BunnyVideoStatus, string> = {
  0: "Created",
  1: "Uploaded",
  2: "Processing",
  3: "Transcoding",
  4: "Finished",
  5: "Error",
  6: "UploadFailed",
  7: "JitSegmenting",
  8: "JitPlaylistsCreated",
};

export function bunnyPlayerUrl(libraryId: string, guid: string): string {
  return `https://iframe.mediadelivery.net/play/${libraryId}/${guid}`;
}

export function bunnyStatusLabel(status: BunnyVideoStatus): string {
  return STATUS_LABEL[status];
}
