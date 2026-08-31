"use client";

import { useRequest } from "ahooks";

import type { QueryResult } from "@/lib/data/result";
import type { RoadmapData } from "@/lib/github/types";

export function useRoadmap(): QueryResult<RoadmapData> {
  const { data, error, loading } = useRequest(fetchRoadmap);

  return {
    data: data ?? undefined,
    error: error ?? null,
    isError: !!error,
    isFetching: loading,
    isLoading: loading,
    notFound: false,
  };
}

async function fetchRoadmap(): Promise<RoadmapData> {
  const res = await fetch("/api/github/roadmap");

  if (!res.ok) {
    throw new Error(`Failed to fetch roadmap: ${res.status}`);
  }

  return res.json();
}
