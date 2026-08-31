import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { requireEnv } from "../../_shared/env.ts";
import {
  assertPublicMcpUrl,
  createGuardedFetch,
  mcpAllowedHosts,
  type NetworkFetch,
  resolveDnsAddresses,
} from "./network-policy.ts";

export async function createMcpClient(
  url: string,
  headers: Record<string, string>,
): Promise<Client> {
  const endpoint = new URL(url);
  const policy = {
    allowedHosts: mcpAllowedHosts(Deno.env.get("AI_MCP_ALLOWED_HOSTS")),
    resolveHost: resolveDnsAddresses,
  };

  await assertPublicMcpUrl(endpoint, policy);

  return connectMcp(endpoint, headers, createGuardedFetch(policy));
}

export function createWowlabMcp(tokenApi: string): Promise<Client> {
  return connectMcp(new URL("/mcp", requireEnv("SENTINEL_URL")), {
    Authorization: `Bearer ${tokenApi}`,
  });
}

async function connectMcp(
  endpoint: URL,
  headers: Record<string, string>,
  guardedFetch?: NetworkFetch,
): Promise<Client> {
  const transport = new StreamableHTTPClientTransport(endpoint, {
    fetch: guardedFetch,
    requestInit: { headers, redirect: "manual" },
  });

  const client = new Client(
    { name: "wowlab-studio-assistant", version: "1.0.0" },
    { capabilities: {} },
  );

  await client.connect(transport);

  return client;
}
