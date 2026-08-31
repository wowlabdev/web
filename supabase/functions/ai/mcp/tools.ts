import type { ToolSet } from "ai";

import { dynamicTool, jsonSchema } from "ai";

import type { ToolResultBuffer } from "./buffer.ts";

const CURATED_TOOLS = new Set([
  "decode_loadout",
  "get_rotation",
  "get_schema",
  "list_rotations",
  "list_spell_labels",
  "list_tables",
  "parse_simc",
  "query",
  "query_count",
  "resolve_effects",
]);

const QUERY_LIMIT_CAP = 25;
const OUTPUT_BUDGET_BYTES = 40_000;
const RAW_RESPONSE_CEILING = 200_000;
const MCP_CALL_TIMEOUT_MS = 10_000;
const MAX_TOOLS_PER_SERVER = 64;

const HEAVY_TABLES = new Set(["game.items", "game.spells"]);

const SPELL_KEEP = [
  "id",
  "name",
  "school",
  "school_mask",
  "cast_time",
  "recovery_time",
  "start_recovery_time",
  "charge_recovery_time",
  "max_charges",
  "duration",
  "max_duration",
  "max_stacks",
  "mana_cost",
  "power_costs",
  "labels",
  "is_passive",
  "periodic_type",
  "tick_period_ms",
];

const ITEM_KEEP = [
  "id",
  "name",
  "item_level",
  "quality",
  "inventory_type",
  "binding",
  "stats",
  "sockets",
  "effects",
  "set_info",
];

const EFFECT_KEEP = [
  "index",
  "effect",
  "aura",
  "base_points",
  "period",
  "trigger_spell",
  "coefficient",
  "misc_value_0",
  "misc_value_1",
];

export type McpToolClient = {
  callTool: (
    request: { arguments: Record<string, unknown>; name: string },
    resultSchema?: unknown,
    options?: { timeout?: number },
  ) => Promise<unknown>;
  listTools: () => Promise<{
    tools: {
      description?: string;
      inputSchema: Parameters<typeof jsonSchema>[0];
      name: string;
    }[];
  }>;
};

// Shared across all servers in a request so the cap is on total output, not per-server.
export type OutputBudget = { used: number };

type Json = Record<string, unknown>;

export async function buildServerToolset(opts: {
  client: McpToolClient;
  buffer: ToolResultBuffer;
  budget: OutputBudget;
  prefix: string;
  wowlab: boolean;
}): Promise<ToolSet> {
  const { budget, buffer, client, prefix, wowlab } = opts;
  const listed = await client.listTools();
  const toolset: ToolSet = {};

  const callGoverned = async (
    toolName: string,
    rawArgs: Record<string, unknown>,
  ): Promise<unknown> => {
    if (budget.used >= OUTPUT_BUDGET_BYTES) {
      return {
        error:
          "Output budget reached — do not call more tools; summarize from what you already have.",
      };
    }

    let args: Json = isObject(rawArgs) ? rawArgs : {};

    if (wowlab && toolName === "query") {
      const clamped = clampQueryArgs(args);

      if ("error" in clamped) {
        return { error: clamped.error };
      }

      args = clamped.args;
    }

    let text: string;

    try {
      const result = await client.callTool(
        { arguments: args, name: toolName },
        undefined,
        { timeout: MCP_CALL_TIMEOUT_MS },
      );

      text = extractText(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";

      return {
        error: `MCP tool "${toolName}" failed: ${message}. Continue without it.`,
      };
    }

    if (text.length > RAW_RESPONSE_CEILING) {
      const summary = `Tool "${toolName}" returned ${text.length} chars (over the ${RAW_RESPONSE_CEILING}-char raw ceiling). Truncated preview:\n${text.slice(
        0,
        1500,
      )}`;

      budget.used += summary.length;

      return { error: summary };
    }

    let projected: unknown;

    try {
      const parsed = JSON.parse(text);

      projected = wowlab ? projectByTool(toolName, args, parsed) : parsed;
    } catch {
      projected = text;
    }

    const stored = buffer.maybeStore(projected);

    if ("inline" in stored) {
      const serialized =
        typeof stored.inline === "string"
          ? stored.inline
          : (JSON.stringify(stored.inline) ?? "null");

      budget.used += serialized.length;

      return stored.inline;
    }

    budget.used += stored.preview.length;

    return {
      bufferId: stored.bufferId,
      note: `Result truncated to a preview. Call read_tool_buffer with buffer_id="${stored.bufferId}" (offset/limit) to read the rest.`,
      preview: stored.preview,
      totalChars: stored.totalChars,
    };
  };

  for (const mcpTool of listed.tools.slice(0, MAX_TOOLS_PER_SERVER)) {
    if (wowlab && !CURATED_TOOLS.has(mcpTool.name)) {
      continue;
    }

    const toolName = mcpTool.name;

    toolset[`${prefix}__${toolName}`] = dynamicTool({
      description: mcpTool.description ?? `MCP tool: ${toolName}`,
      execute: (args) => callGoverned(toolName, isObject(args) ? args : {}),
      inputSchema: jsonSchema(mcpTool.inputSchema),
    });
  }

  return toolset;
}

export function readToolBufferTool(
  buffer: ToolResultBuffer,
  budget: OutputBudget,
): ToolSet {
  return {
    read_tool_buffer: dynamicTool({
      description:
        "Read a section of a buffered tool result. Large tool outputs are stored in buffers and previewed; use this to page through the full content.",
      execute: (args) => {
        if (budget.used >= OUTPUT_BUDGET_BYTES) {
          return { error: "Output budget reached" };
        }

        const a = isObject(args) ? args : {};
        const result = buffer.read(
          String(a.buffer_id ?? ""),
          typeof a.offset === "number" ? a.offset : 0,
          typeof a.limit === "number" ? a.limit : undefined,
        );

        budget.used += result.length;

        return { result };
      },
      inputSchema: jsonSchema({
        properties: {
          buffer_id: {
            description: "Buffer id, e.g. buffer_1",
            type: "string",
          },
          limit: {
            description: "Max chars to return (default 4000)",
            type: "number",
          },
          offset: {
            description: "Char offset to start at (default 0)",
            type: "number",
          },
        },
        required: ["buffer_id"],
        type: "object",
      }),
    }),
  };
}

function clampQueryArgs(args: Json): { args: Json } | { error: string } {
  const table = typeof args.table === "string" ? args.table : "";

  if (HEAVY_TABLES.has(table) && !hasFilters(args)) {
    return {
      error: `Refused: a "${table}" query must include filters — an unfiltered scan of this table is too large. Add filters (e.g. by id or labels) and retry.`,
    };
  }

  const requestedLimit =
    typeof args.limit === "number" && Number.isFinite(args.limit)
      ? Math.trunc(args.limit)
      : QUERY_LIMIT_CAP;
  const limit = Math.max(1, Math.min(requestedLimit, QUERY_LIMIT_CAP));

  return { args: { ...args, limit } };
}

function extractText(result: unknown): string {
  if (!isObject(result) || !Array.isArray(result.content)) {
    return JSON.stringify(result);
  }

  const parts = result.content
    .filter(
      (c): c is { type: string; text: string } =>
        isObject(c) && c.type === "text" && typeof c.text === "string",
    )
    .map((c) => c.text);

  return parts.length > 0 ? parts.join("\n") : JSON.stringify(result.content);
}

function hasFilters(args: Json): boolean {
  const filters = args.filters;

  if (Array.isArray(filters)) {
    return filters.length > 0;
  }

  return isObject(filters) && Object.keys(filters).length > 0;
}

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pick(row: Json, keep: string[]): Json {
  const out: Json = {};

  for (const key of keep) {
    if (key in row) {
      out[key] = row[key];
    }
  }

  return out;
}

function projectByTool(toolName: string, args: Json, value: unknown): unknown {
  if (toolName === "resolve_effects") {
    return projectResolveEffects(value);
  }

  if (toolName === "query") {
    const table = typeof args.table === "string" ? args.table : "";

    if (table === "game.spells") {
      return projectRows(value, SPELL_KEEP);
    }

    if (table === "game.items") {
      return projectRows(value, ITEM_KEEP);
    }
  }

  return value;
}

function projectResolveEffects(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((n) => projectSpellLike(n));
  }

  if (isObject(value) && Array.isArray(value.spells)) {
    return { ...value, spells: value.spells.map((n) => projectSpellLike(n)) };
  }

  if (isObject(value) && Array.isArray(value.effects)) {
    return projectSpellLike(value);
  }

  return value;
}

function projectRows(value: unknown, keep: string[]): unknown {
  const mapRow = (r: unknown) => (isObject(r) ? pick(r, keep) : r);

  if (Array.isArray(value)) {
    return value.map((r) => mapRow(r));
  }

  if (isObject(value)) {
    for (const arrayKey of ["rows", "data", "results"]) {
      const rows = value[arrayKey];

      if (Array.isArray(rows)) {
        return {
          ...value,
          [arrayKey]: rows.map((row) => mapRow(row)),
        };
      }
    }
  }

  return value;
}

function projectSpellLike(node: unknown): unknown {
  if (!isObject(node)) {
    return node;
  }

  const kept = pick(node, ["id", "name", "school_mask", "duration"]);

  if (Array.isArray(node.effects)) {
    kept.effects = node.effects.map((e) =>
      isObject(e) ? pick(e, EFFECT_KEEP) : e,
    );
  }

  if (Array.isArray(node.trigger_spells)) {
    kept.trigger_spells = node.trigger_spells.map((n) => projectSpellLike(n));
  }

  return kept;
}
