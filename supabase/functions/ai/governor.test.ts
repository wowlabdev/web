import type { Tool } from "ai";

import { assert, assertEquals } from "@std/assert";

import { ToolResultBuffer } from "./mcp/buffer.ts";
import {
  buildServerToolset,
  type McpToolClient,
  readToolBufferTool,
} from "./mcp/tools.ts";

const CURATED = [
  "list_spell_labels",
  "list_rotations",
  "get_rotation",
  "parse_simc",
  "decode_loadout",
  "resolve_effects",
  "query",
  "query_count",
  "get_schema",
  "list_tables",
];

const NOISY_EFFECT = {
  amplitude: 0,
  aura: 226,
  base_points: 40,
  bonus_coefficient: 0,
  chain_targets: 0,
  coefficient: 0,
  effect: 6,
  index: 0,
  misc_value_0: 0,
  misc_value_1: 0,
  period: 500,
  pvp_multiplier: 0.625,
  radius_max: 0,
  radius_min: 0,
  trigger_spell: 0,
  variance: 0,
};

function exec(tool: Tool, args: Record<string, unknown>): Promise<unknown> {
  const fn = "execute" in tool ? tool.execute : undefined;

  if (typeof fn !== "function") {
    throw new TypeError("no execute");
  }

  return fn(args, { context: undefined, messages: [], toolCallId: "t" });
}

function fakeClient(opts: {
  respond: (name: string, args: Record<string, unknown>) => unknown;
  throwOn?: string;
}): {
  client: McpToolClient;
  calls: { name: string; args: Record<string, unknown> }[];
} {
  const calls: { name: string; args: Record<string, unknown> }[] = [];
  const client = {
    callTool: ({
      arguments: args,
      name,
    }: {
      name: string;
      arguments: Record<string, unknown>;
    }) => {
      calls.push({ args, name });

      if (opts.throwOn === name) {
        throw new Error("boom");
      }

      const payload = opts.respond(name, args);

      return Promise.resolve({
        content: [
          {
            text:
              typeof payload === "string" ? payload : JSON.stringify(payload),
            type: "text",
          },
        ],
      });
    },
    listTools: () =>
      Promise.resolve({
        tools: CURATED.map((name) => ({
          description: `tool ${name}`,
          inputSchema: { properties: {}, type: "object" },
          name,
        })),
      }),
  } satisfies McpToolClient;

  return { calls, client };
}

Deno.test("governor projects noisy resolve_effects fields", async () => {
  const { client } = fakeClient({
    respond: () => ({
      spells: [
        {
          duration: 0,
          effects: [NOISY_EFFECT],
          id: 1,
          name: "Fireball",
          school_mask: 4,
        },
      ],
    }),
  });
  const toolset = await buildServerToolset({
    budget: { used: 0 },
    buffer: new ToolResultBuffer(),
    client,
    prefix: "wowlab",
    wowlab: true,
  });
  const result = await exec(toolset.wowlab__resolve_effects, { ids: [1] });
  const s = JSON.stringify(result);

  assert(!s.includes("pvp_multiplier"));
  assert(!s.includes("radius_max"));
  assert(s.includes("base_points"));
});

Deno.test("governor clamps query limit to <= 25", async () => {
  const { calls, client } = fakeClient({ respond: () => ({ rows: [] }) });
  const toolset = await buildServerToolset({
    budget: { used: 0 },
    buffer: new ToolResultBuffer(),
    client,
    prefix: "wowlab",
    wowlab: true,
  });

  await exec(toolset.wowlab__query, {
    filters: { id: 1 },
    limit: 1000,
    table: "game.items",
  });
  assertEquals(calls[0]?.args.limit, 25);
});

Deno.test("governor clamps invalid query limits to one", async () => {
  const { calls, client } = fakeClient({ respond: () => ({ rows: [] }) });
  const toolset = await buildServerToolset({
    budget: { used: 0 },
    buffer: new ToolResultBuffer(),
    client,
    prefix: "wowlab",
    wowlab: true,
  });

  await exec(toolset.wowlab__query, {
    filters: { id: 1 },
    limit: -10,
    table: "game.items",
  });
  assertEquals(calls[0]?.args.limit, 1);
});

Deno.test("governor rejects unfiltered heavy query", async () => {
  const { calls, client } = fakeClient({ respond: () => ({ rows: [] }) });
  const toolset = await buildServerToolset({
    budget: { used: 0 },
    buffer: new ToolResultBuffer(),
    client,
    prefix: "wowlab",
    wowlab: true,
  });
  const result = await exec(toolset.wowlab__query, {
    table: "game.spells",
  });

  assert(isRecord(result));
  assert(typeof result.error === "string" && /filter/i.test(result.error));
  assertEquals(calls.length, 0);
});

Deno.test("governor returns { error } when a tool throws", async () => {
  const { client } = fakeClient({
    respond: () => ({ ok: true }),
    throwOn: "get_rotation",
  });
  const toolset = await buildServerToolset({
    budget: { used: 0 },
    buffer: new ToolResultBuffer(),
    client,
    prefix: "wowlab",
    wowlab: true,
  });
  const result = await exec(toolset.wowlab__get_rotation, { id: 1 });

  assert(isRecord(result));
  assert(result.error);
});

Deno.test("buffer inlines small and buffers large", () => {
  const buffer = new ToolResultBuffer(100);

  assert("inline" in buffer.maybeStore({ a: 1 }));
  assert("bufferId" in buffer.maybeStore({ blob: "x".repeat(200) }));
});

Deno.test("buffer reads stay within the page limit", async () => {
  const buffer = new ToolResultBuffer(10);
  const stored = buffer.maybeStore("x".repeat(10_000));

  if (!("bufferId" in stored)) {
    throw new Error("expected buffered result");
  }

  const toolset = readToolBufferTool(buffer, { used: 0 });
  const result = await exec(toolset.read_tool_buffer, {
    buffer_id: stored.bufferId,
    limit: 100_000,
  });

  assert(isRecord(result));
  assert(typeof result.result === "string");
  assert(result.result.length < 4200);
  assert(result.result.includes("more chars available"));
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
