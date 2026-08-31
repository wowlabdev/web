"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryResult } from "@/lib/data/result";
import type { FleetData } from "@/lib/headscale/fleet";

import { toQueryResult } from "@/lib/data/result";

import { fetchJson } from "./shared";

export type {
  FleetData,
  FleetNode,
  FleetPreAuthKey,
  FleetUser,
} from "@/lib/headscale/fleet";

const FLEET_KEY = ["fleet"] as const;

export function useCreatePreAuthKey() {
  return useFleetMutation<
    {
      userId: string;
      reusable: boolean;
      ephemeral: boolean;
      expiration: string;
      aclTags: string[];
    },
    { preAuthKey: { key: string } }
  >(async (input) =>
    fetchJson<{ preAuthKey: { key: string } }>(
      "/api/fleet/preauthkeys",
      {
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
      httpError,
    ),
  );
}

export function useDeleteNode() {
  return useFleetMutation<string, void>(async (id) => {
    await fetchJson(`/api/fleet/nodes/${id}`, { method: "DELETE" }, httpError);
  });
}

export function useExpireNode() {
  return useFleetMutation<string, void>(async (id) => {
    await fetchJson(
      `/api/fleet/nodes/${id}/expire`,
      { method: "POST" },
      httpError,
    );
  });
}

export function useExpirePreAuthKey() {
  return useFleetMutation<{ userId: string; key: string }, void>(
    async ({ key, userId }) => {
      await fetchJson(
        "/api/fleet/preauthkeys/expire",
        {
          body: JSON.stringify({ key, userId }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        },
        httpError,
      );
    },
  );
}

export function useFleet(): QueryResult<FleetData> {
  return toQueryResult(
    useQuery<FleetData>({
      queryFn: () => fetchJson<FleetData>("/api/fleet", undefined, httpError),
      queryKey: FLEET_KEY,
      refetchInterval: 30_000,
      staleTime: 10_000,
    }),
  );
}

export function useRenameNode() {
  return useFleetMutation<{ id: string; newName: string }, void>(
    async ({ id, newName }) => {
      await fetchJson(
        `/api/fleet/nodes/${id}/rename`,
        {
          body: JSON.stringify({ newName }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        },
        httpError,
      );
    },
  );
}

export function useSetNodeTags() {
  return useFleetMutation<{ id: string; tags: string[] }, void>(
    async ({ id, tags }) => {
      await fetchJson(
        `/api/fleet/nodes/${id}/tags`,
        {
          body: JSON.stringify({ tags }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        },
        httpError,
      );
    },
  );
}

function httpError(response: Response): string {
  return `HTTP ${response.status}`;
}

function useFleetMutation<TInput, TResult>(
  fn: (input: TInput) => Promise<TResult>,
) {
  const queryClient = useQueryClient();

  return useMutation<TResult, Error, TInput>({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLEET_KEY });
    },
  });
}
