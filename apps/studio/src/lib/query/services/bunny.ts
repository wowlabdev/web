"use client";

import { useQuery } from "@tanstack/react-query";

import type { BunnyVideo } from "@/lib/bunny/types";
import type { QueryListResult } from "@/lib/data/result";

import { toQueryListResult } from "@/lib/data/result";

import { fetchJson } from "./shared";

export type { BunnyVideo, BunnyVideoStatus } from "@/lib/bunny/types";

const BUNNY_VIDEOS_KEY = ["bunny", "videos"] as const;

export function useBunnyVideos(): QueryListResult<BunnyVideo> {
  return toQueryListResult(
    useQuery<BunnyVideo[]>({
      queryFn: () =>
        fetchJson<BunnyVideo[]>(
          "/api/bunny/videos",
          undefined,
          (response) => `HTTP ${response.status}`,
        ),
      queryKey: BUNNY_VIDEOS_KEY,
      refetchInterval: 60_000,
      staleTime: 30_000,
    }),
  );
}
