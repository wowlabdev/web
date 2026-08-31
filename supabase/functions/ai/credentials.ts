import type {
  AiProvider,
  McpServerConfig,
} from "@wowlab/shared/lib/ai-contract";

import { isAiProvider } from "@wowlab/shared/lib/ai-contract";
import postgres from "postgres";

import { requireEnv } from "../_shared/env.ts";

const sql = postgres(requireEnv("SUPABASE_DB_URL"), { prepare: false });

const MAX_MCP_SERVERS = 8;
const MCP_ID = /^[a-zA-Z0-9_-]{1,64}$/;
const HEADER_NAME = /^[!#$%&'*+.^_`|~0-9a-zA-Z-]+$/;

export type AiCredentials = {
  provider: AiProvider;
  model: string;
  apiKey: string;
  tokenApi: string;
  mcpServers: McpServerConfig[];
};

type Row = {
  ai_provider: string | null;
  ai_model: string | null;
  token_api: string | null;
  api_key: string | null;
  mcp_servers: unknown;
};

export async function getAiCredentials(
  sub: string,
): Promise<AiCredentials | null> {
  const rows = await sql<Row[]>`
    select
      us.ai_provider,
      us.ai_model,
      us.token_api,
      us.mcp_servers,
      v.decrypted_secret as api_key
    from public.user_settings us
    left join vault.decrypted_secrets v on v.id = us.ai_key_secret_id
    where us.id = ${sub}
    limit 1
  `;

  const row = rows[0];

  if (!row || !isAiProvider(row.ai_provider) || !row.ai_model || !row.api_key) {
    return null;
  }

  return {
    apiKey: row.api_key,
    mcpServers: parseMcpServers(row.mcp_servers),
    model: row.ai_model,
    provider: row.ai_provider,
    tokenApi: row.token_api ?? "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSecureUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function parseMcpServers(value: unknown): McpServerConfig[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const servers: McpServerConfig[] = [];

  for (const entry of value.slice(0, MAX_MCP_SERVERS)) {
    if (!isRecord(entry)) {
      continue;
    }

    const { headerName, headerValue, id, label, url } = entry;

    if (
      typeof id !== "string" ||
      !MCP_ID.test(id) ||
      typeof label !== "string" ||
      !label.trim() ||
      label.length > 100 ||
      typeof url !== "string" ||
      url.length > 2048 ||
      !isSecureUrl(url)
    ) {
      continue;
    }

    const server: McpServerConfig = { id, label, url };

    if (
      typeof headerName === "string" &&
      HEADER_NAME.test(headerName) &&
      typeof headerValue === "string" &&
      headerValue &&
      headerValue.length <= 4096 &&
      !/[\r\n]/.test(headerValue)
    ) {
      server.headerName = headerName;
      server.headerValue = headerValue;
    }

    servers.push(server);
  }

  return servers;
}
