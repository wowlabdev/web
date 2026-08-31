import "@supabase/functions-js/edge-runtime.d.ts";

import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import type { AiGrammar, AiObjectKind } from "@wowlab/shared/lib/ai-contract";
import type { ModelMessage, ToolSet } from "ai";

import { isAiProvider } from "@wowlab/shared/lib/ai-contract";
import { generateText, jsonSchema, Output, stepCountIs, streamText } from "ai";

import { corsHeaders, json, options } from "../_shared/response.ts";
import { verifyUser } from "./auth.ts";
import { type AiCredentials, getAiCredentials } from "./credentials.ts";
import { ToolResultBuffer } from "./mcp/buffer.ts";
import { createMcpClient, createWowlabMcp } from "./mcp/client.ts";
import {
  buildServerToolset,
  type OutputBudget,
  readToolBufferTool,
} from "./mcp/tools.ts";
import { buildChatSystemPrompt, buildObjectSystemPrompt } from "./prompts.ts";
import { listModels, resolveModel, validateKey } from "./providers/registry.ts";
// Generated from the Rust rotation AST by `cargo forge gen-rotation-schema` — single source of truth.
import dslSchemaJson from "./rotation.schema.json" with { type: "json" };

const dslSchema: Record<
  "rotation" | "action" | "condition",
  Parameters<typeof jsonSchema>[0]
> = dslSchemaJson;

type JsonObject = Record<string, unknown>;

async function closeQuietly(client: Client | null): Promise<void> {
  if (!client) {
    return;
  }

  try {
    await client.close();
  } catch {
    return;
  }
}

async function connectMcpServers(
  creds: AiCredentials,
  buffer: ToolResultBuffer,
  budget: OutputBudget,
): Promise<{ clients: Client[]; tools: ToolSet }> {
  const plans: {
    connect: () => Promise<Client>;
    prefix: string;
    wowlab: boolean;
  }[] = [];

  if (creds.tokenApi) {
    plans.push({
      connect: () => createWowlabMcp(creds.tokenApi),
      prefix: "wowlab",
      wowlab: true,
    });
  }

  for (const server of creds.mcpServers) {
    const headers =
      server.headerName && server.headerValue
        ? { [server.headerName]: server.headerValue }
        : {};

    plans.push({
      connect: () => createMcpClient(server.url, headers),
      prefix: server.id,
      wowlab: false,
    });
  }

  const clients: Client[] = [];
  let tools: ToolSet = {};

  for (const plan of plans) {
    let client: Client | null = null;

    try {
      client = await plan.connect();

      const serverTools = await buildServerToolset({
        budget,
        buffer,
        client,
        prefix: plan.prefix,
        wowlab: plan.wowlab,
      });

      clients.push(client);
      tools = { ...tools, ...serverTools };
    } catch {
      await closeQuietly(client);
    }
  }

  if (clients.length > 0) {
    tools = { ...tools, ...readToolBufferTool(buffer, budget) };
  }

  return { clients, tools };
}

async function handleChat(
  creds: AiCredentials,
  body: unknown,
): Promise<Response> {
  const input = isObject(body) ? body : {};
  const messages = input.messages;

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    !messages.every((message): message is ModelMessage =>
      isModelMessage(message),
    )
  ) {
    return json({ error: "invalid_request" }, 400);
  }

  const model = resolveModel(creds.provider, creds.model, creds.apiKey);
  const buffer = new ToolResultBuffer();
  const budget: OutputBudget = { used: 0 };

  const { clients, tools } = await connectMcpServers(creds, buffer, budget);

  const closeMcp = async () => {
    const openClients = clients.splice(0);

    await Promise.all(openClients.map((client) => closeQuietly(client)));
  };

  const result = streamText({
    messages,
    model,
    onAbort: closeMcp,
    onError: closeMcp,
    onFinish: closeMcp,
    stopWhen: stepCountIs(8),
    system: buildChatSystemPrompt({
      contextMarkdown:
        typeof input.contextMarkdown === "string" ? input.contextMarkdown : "",
      toolsAvailable: Object.keys(tools).length > 0,
    }),
    tools,
  });

  return result.toUIMessageStreamResponse({
    headers: corsHeaders,
    messageMetadata: ({ part }) =>
      part.type === "finish"
        ? {
            finishReason: part.finishReason,
            model: creds.model,
            usage: part.totalUsage,
          }
        : undefined,
  });
}

async function handleModels(creds: AiCredentials): Promise<Response> {
  return json({ models: await listModels(creds.provider, creds.apiKey) });
}

async function handleObject(
  creds: AiCredentials,
  body: unknown,
): Promise<Response> {
  const input = isObject(body) ? body : {};

  if (
    !isAiObjectKind(input.kind) ||
    !isAiGrammar(input.grammar) ||
    typeof input.request !== "string"
  ) {
    return json({ error: "invalid_request" }, 400);
  }

  const system = buildObjectSystemPrompt({
    contextMarkdown:
      typeof input.contextMarkdown === "string" ? input.contextMarkdown : "",
    grammar: input.grammar,
    kind: input.kind,
    priorCandidate: input.priorCandidate,
    priorErrors: recordArray(input.priorErrors),
  });
  const model = resolveModel(creds.provider, creds.model, creds.apiKey);
  const output =
    input.kind === "list"
      ? Output.array({ element: jsonSchema(dslSchema.action) })
      : Output.object({
          schema: jsonSchema(
            input.kind === "rotation"
              ? dslSchema.rotation
              : dslSchema.condition,
          ),
        });

  const { output: object } = await generateText({
    model,
    output,
    prompt: input.request,
    system,
  });

  return json({ object });
}

async function handleValidateKey(body: unknown): Promise<Response> {
  const input = isObject(body) ? body : {};

  if (!isAiProvider(input.provider) || typeof input.apiKey !== "string") {
    return json({ error: "invalid_request" }, 400);
  }

  return json(await validateKey(input.provider, input.apiKey));
}

function isAiGrammar(value: unknown): value is AiGrammar {
  return (
    isObject(value) &&
    Array.isArray(value.descriptors) &&
    value.descriptors.every((descriptor) => isFieldDescriptor(descriptor)) &&
    isStringArray(value.spellSlugs) &&
    isStringArray(value.auraSlugs) &&
    isStringArray(value.resourceNames)
  );
}

function isAiObjectKind(value: unknown): value is AiObjectKind {
  return value === "condition" || value === "list" || value === "rotation";
}

function isFieldDescriptor(value: unknown): boolean {
  return (
    isObject(value) &&
    typeof value.domain === "string" &&
    typeof value.name === "string" &&
    typeof value.field_type === "string" &&
    typeof value.description === "string" &&
    (value.key_domain === undefined ||
      value.key_domain === null ||
      typeof value.key_domain === "string")
  );
}

function isModelMessage(value: unknown): value is ModelMessage {
  if (!isObject(value)) {
    return false;
  }

  if (value.role === "system") {
    return typeof value.content === "string";
  }

  if (value.role === "tool") {
    return Array.isArray(value.content);
  }

  return (
    (value.role === "assistant" || value.role === "user") &&
    (typeof value.content === "string" || Array.isArray(value.content))
  );
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((entry) => typeof entry === "string")
  );
}

function recordArray(value: unknown): JsonObject[] | undefined {
  return Array.isArray(value) && value.every((entry) => isObject(entry))
    ? value
    : undefined;
}

async function requireCreds(sub: string): Promise<AiCredentials | Response> {
  const creds = await getAiCredentials(sub);

  return creds ?? json({ error: "ai_not_configured" }, 409);
}

function routeOf(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const offset = parts[0] === "ai" ? 1 : 0;

  return parts[offset] ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return options();
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const sub = await verifyUser(req);

  if (!sub) {
    return json({ error: "unauthorized" }, 401);
  }

  const route = routeOf(new URL(req.url).pathname);
  const body = await req.json().catch(() => null);

  try {
    if (route === "validate-key") {
      return await handleValidateKey(body);
    }

    if (route === "models" || route === "object" || route === "chat") {
      const creds = await requireCreds(sub);

      if (creds instanceof Response) {
        return creds;
      }

      if (route === "models") {
        return await handleModels(creds);
      }

      if (route === "object") {
        return await handleObject(creds, body);
      }

      return await handleChat(creds, body);
    }

    return json({ error: "not_found" }, 404);
  } catch (error) {
    console.error("AI request failed", error);

    return json({ error: "upstream_error" }, 502);
  }
});
