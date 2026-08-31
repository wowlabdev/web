import "server-only";

import {
  getPrometheusConfig,
  parsePrometheusInstantResponse,
} from "@/lib/metrics";
import { createClient } from "@wowlab/shared/lib/supabase/server";

import type { V1PreAuthKey } from "./types";

import * as headscale from "./client";

export type FleetData = {
  nodes: FleetNode[];
  users: FleetUser[];
  preAuthKeys: FleetPreAuthKey[];
};

export type FleetNode = {
  id: string;
  name: string;
  givenName: string;
  ipAddresses: string[];
  userId: string;
  userName: string;
  lastSeen: string | null;
  online: boolean;
  tags: string[];
  createdAt: string | null;
  publicKey: string | null;
  status: string | null;
  totalCores: number | null;
  version: string | null;
  platform: string | null;
  chunksCompleted: number;
};

export type FleetPreAuthKey = {
  id: string;
  key: string;
  userId: string;
  userName: string;
  reusable: boolean;
  ephemeral: boolean;
  used: boolean;
  expiration: string | null;
  createdAt: string | null;
  aclTags: string[];
};

export type FleetUser = { id: string; name: string };

export async function loadFleet(): Promise<FleetData> {
  const supabase = await createClient();

  const [nodes, users, wowlab, chunks] = await Promise.all([
    headscale.listNodes(),
    headscale.listUsers(),
    supabase
      .from("nodes")
      .select(
        "public_key, name, status, total_cores, version, platform, last_seen_at",
      ),
    chunksByNode(),
  ]);

  if (wowlab.error) {
    throw wowlab.error;
  }

  const wowlabByName = new Map(wowlab.data.map((row) => [row.name, row]));

  const perUserKeys = await Promise.all(
    users.map((user) => headscale.listPreAuthKeys(user.id)),
  );

  const fleetNodes: FleetNode[] = nodes.map((node) => {
    const row = wowlabByName.get(node.givenName) ?? null;
    const publicKey = row?.public_key ?? null;

    return {
      chunksCompleted: publicKey ? (chunks.get(publicKey) ?? 0) : 0,
      createdAt: node.createdAt,
      givenName: node.givenName,
      id: node.id,
      ipAddresses: node.ipAddresses,
      lastSeen: node.lastSeen,
      name: node.name,
      online: node.online,
      platform: row?.platform ?? null,
      publicKey,
      status: row?.status ?? null,
      tags: node.tags,
      totalCores: row?.total_cores ?? null,
      userId: node.user.id,
      userName: node.user.name,
      version: row?.version ?? null,
    };
  });

  const fleetKeys: FleetPreAuthKey[] = perUserKeys
    .flat()
    .map((key: V1PreAuthKey) => ({
      aclTags: key.aclTags,
      createdAt: key.createdAt,
      ephemeral: key.ephemeral,
      expiration: key.expiration,
      id: key.id,
      key: key.key,
      reusable: key.reusable,
      used: key.used,
      userId: key.user.id,
      userName: key.user.name,
    }));

  return {
    nodes: fleetNodes,
    preAuthKeys: fleetKeys,
    users: users.map((u) => ({ id: u.id, name: u.name })),
  };
}

async function chunksByNode(): Promise<Map<string, number>> {
  const config = getPrometheusConfig();
  const map = new Map<string, number>();

  if (!config) {
    return map;
  }

  const basicAuth = btoa(`${config.user}:${config.token}`);
  const params = new URLSearchParams({
    query: "sentinel_chunks_completed_total",
  });
  const response = await fetch(`${config.url}/api/v1/query?${params}`, {
    cache: "no-store",
    headers: { Authorization: `Basic ${basicAuth}` },
  });

  if (!response.ok) {
    return map;
  }

  const json = parsePrometheusInstantResponse(await response.json());

  if (!json || json.status !== "success") {
    return map;
  }

  for (const sample of json.data.result) {
    const key = sample.metric.node_public_key;

    if (!key) {
      continue;
    }

    const value = Number.parseFloat(sample.value[1]);

    if (Number.isFinite(value)) {
      map.set(key, Math.round(value));
    }
  }

  return map;
}
