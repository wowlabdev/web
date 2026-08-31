import type { McpServerInput } from "./mcp-server";

import { withOptionalHeader } from "./mcp-server";

export function parseMcpAddCommand(input: string): McpServerInput | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.startsWith("{") ? parseJsonConfig(trimmed) : parseCli(trimmed);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCli(input: string): McpServerInput | null {
  const tokens = tokenize(input);
  const start = tokens[1] === "mcp" && tokens[2] === "add" ? 3 : 0;
  const args = tokens.slice(start);

  const positional: string[] = [];
  let headerName: string | undefined;
  let headerValue: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--transport" || arg === "-t") {
      i++;
    } else if (arg === "--header" || arg === "-H") {
      const raw = args[++i] ?? "";
      const colon = raw.indexOf(":");

      if (colon > 0 && headerName === undefined) {
        headerName = raw.slice(0, colon).trim();
        headerValue = raw.slice(colon + 1).trim();
      }
    } else if (!arg.startsWith("-")) {
      positional.push(arg);
    }
  }

  if (positional.length < 2) {
    return null;
  }

  return withOptionalHeader(
    { label: positional[0], url: positional[1] },
    headerName,
    headerValue,
  );
}

function parseJsonConfig(input: string): McpServerInput | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) {
    return null;
  }

  const servers = parsed.mcpServers ?? parsed.servers ?? parsed.mcp;

  if (!isRecord(servers)) {
    return null;
  }

  const first = Object.entries(servers).find(
    (entry): entry is [string, Record<string, unknown>] => isRecord(entry[1]),
  );

  if (!first) {
    return null;
  }

  const [label, config] = first;
  const url =
    config.url ?? config.httpUrl ?? config.serverUrl ?? config.command;

  if (typeof url !== "string" || !url) {
    return null;
  }

  const headers = config.headers ?? config.http_headers;
  const headerEntry = isRecord(headers)
    ? Object.entries(headers).find(
        (entry): entry is [string, string] =>
          typeof entry[1] === "string" && entry[1].length > 0,
      )
    : undefined;

  return withOptionalHeader({ label, url }, headerEntry?.[0], headerEntry?.[1]);
}

function tokenize(input: string): string[] {
  const tokens = input.match(/"[^"]*"|'[^']*'|\S+/g);

  return tokens?.map((token) => token.replaceAll(/^["']|["']$/g, "")) ?? [];
}
