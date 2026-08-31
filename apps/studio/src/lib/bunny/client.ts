import "server-only";

import { authedFetch } from "@/lib/http";

import type { BunnyVideo, BunnyVideoListResponse } from "./types";

const BUNNY_STREAM_BASE_URL = "https://video.bunnycdn.com";
const MAX_PAGE_SIZE = 100;

export async function listAllVideos(): Promise<BunnyVideo[]> {
  const all: BunnyVideo[] = [];
  let page = 1;

  for (;;) {
    const response = await listVideos({
      itemsPerPage: MAX_PAGE_SIZE,
      orderBy: "date",
      page,
    });

    all.push(...response.items);

    const fetched = page * response.itemsPerPage;

    if (response.items.length === 0 || fetched >= response.totalItems) {
      break;
    }

    page += 1;
  }

  return all;
}

export async function listVideos(
  options: { itemsPerPage?: number; orderBy?: string; page?: number } = {},
): Promise<BunnyVideoListResponse> {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID;

  if (!libraryId) {
    throw new Error("NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID is missing");
  }

  const params = new URLSearchParams();

  params.set("page", String(options.page ?? 1));
  params.set("itemsPerPage", String(options.itemsPerPage ?? MAX_PAGE_SIZE));
  params.set("orderBy", options.orderBy ?? "date");

  return bunnyFetch<BunnyVideoListResponse>(
    `/library/${libraryId}/videos?${params}`,
  );
}

async function bunnyFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const apiKey = process.env.BUNNY_STREAM_API_KEY;

  if (!apiKey) {
    throw new Error("BUNNY_STREAM_API_KEY is missing");
  }

  return authedFetch<T>(
    {
      auth: { headerName: "AccessKey", value: apiKey },
      baseUrl: BUNNY_STREAM_BASE_URL,
      errorLabel: "Bunny Stream API",
    },
    path,
    init,
  );
}
