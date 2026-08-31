import type { ComponentType, SVGProps } from "react";

import { stringify as stringifyToml } from "smol-toml";

import { env } from "@wowlab/shared/lib/env";
import {
  ClaudeIcon,
  CursorIcon,
  GeminiIcon,
  JetBrainsIcon,
  KiroIcon,
  OpenAIIcon,
  OpenCodeIcon,
  VSCodeIcon,
  WindsurfIcon,
} from "@wowlab/shared/lib/icons";

export type ClientConfig = {
  cli?: string;
  cliDisplay?: string;
  config: string;
  configDisplay: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  language: string;
  path: string;
};

export const MCP_URL = `${env.SENTINEL_URL}/mcp`;

export const TOKEN_PLACEHOLDER = "wlab_api_xxxxx";

export function buildClientConfigs(token: string): ClientConfig[] {
  const auth = `Bearer ${TOKEN_PLACEHOLDER}`;
  const headers = { Authorization: auth };

  const configs: Omit<ClientConfig, "cli" | "config">[] = [
    {
      cliDisplay: `claude mcp add --transport http wowlab ${MCP_URL} --header "Authorization: ${auth}"`,
      configDisplay: json({
        mcpServers: { wowlab: { headers, type: "http", url: MCP_URL } },
      }),
      icon: ClaudeIcon,
      label: "Claude",
      language: "json",
      path: "~/.claude/settings.json",
    },
    {
      configDisplay: stringifyToml({
        mcp_servers: {
          wowlab: { http_headers: { Authorization: auth }, url: MCP_URL },
        },
      }),
      icon: OpenAIIcon,
      label: "Codex",
      language: "toml",
      path: "~/.codex/config.toml",
    },
    {
      configDisplay: json({
        mcpServers: {
          wowlab: { headers, type: "streamable-http", url: MCP_URL },
        },
      }),
      icon: CursorIcon,
      label: "Cursor",
      language: "json",
      path: ".cursor/mcp.json",
    },
    {
      cliDisplay: `gemini mcp add --transport http wowlab ${MCP_URL} --header "Authorization: ${auth}"`,
      configDisplay: json({
        mcpServers: { wowlab: { headers, httpUrl: MCP_URL } },
      }),
      icon: GeminiIcon,
      label: "Gemini",
      language: "json",
      path: "~/.gemini/settings.json",
    },
    {
      configDisplay: json({
        mcpServers: { wowlab: { headers, url: MCP_URL } },
      }),
      icon: JetBrainsIcon,
      label: "JetBrains",
      language: "json",
      path: "Settings > Tools > AI Assistant > MCP",
    },
    {
      configDisplay: json({
        mcpServers: { wowlab: { headers, url: MCP_URL } },
      }),
      icon: KiroIcon,
      label: "Kiro",
      language: "json",
      path: "~/.kiro/settings/mcp.json",
    },
    {
      configDisplay: json({
        $schema: "https://opencode.ai/config.json",
        mcp: {
          wowlab: {
            enabled: true,
            headers,
            type: "remote",
            url: MCP_URL,
          },
        },
      }),
      icon: OpenCodeIcon,
      label: "OpenCode",
      language: "json",
      path: "~/.config/opencode/opencode.json",
    },
    {
      configDisplay: json({
        servers: { wowlab: { headers, type: "http", url: MCP_URL } },
      }),
      icon: VSCodeIcon,
      label: "VS Code",
      language: "json",
      path: ".vscode/mcp.json",
    },
    {
      configDisplay: json({
        mcpServers: { wowlab: { headers, serverUrl: MCP_URL } },
      }),
      icon: WindsurfIcon,
      label: "Windsurf",
      language: "json",
      path: "~/.codeium/windsurf/mcp_config.json",
    },
  ];

  return configs.map((c) => ({
    ...c,
    cli: c.cliDisplay
      ? c.cliDisplay.replaceAll(TOKEN_PLACEHOLDER, token)
      : undefined,
    config: c.configDisplay.replaceAll(TOKEN_PLACEHOLDER, token),
  }));
}

function json(obj: object): string {
  return JSON.stringify(obj, null, 2);
}
