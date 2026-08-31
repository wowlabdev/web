import "server-only";

import { authedFetch } from "@/lib/http";

import type { V1Node, V1PreAuthKey, V1User } from "./types";

export async function createPreAuthKey(input: {
  userId: string;
  reusable: boolean;
  ephemeral: boolean;
  expiration: string;
  aclTags: string[];
}): Promise<V1PreAuthKey> {
  const json = await headscaleFetch<{ preAuthKey: V1PreAuthKey }>(
    "/api/v1/preauthkey",
    {
      body: JSON.stringify({
        aclTags: input.aclTags,
        ephemeral: input.ephemeral,
        expiration: input.expiration,
        reusable: input.reusable,
        user: input.userId,
      }),
      method: "POST",
    },
  );

  return json.preAuthKey;
}

export async function deleteNode(id: string): Promise<void> {
  await headscaleFetch(`/api/v1/node/${id}`, { method: "DELETE" });
}

export async function expireNode(id: string): Promise<V1Node> {
  const json = await headscaleFetch<{ node: V1Node }>(
    `/api/v1/node/${id}/expire`,
    { method: "POST" },
  );

  return json.node;
}

export async function expirePreAuthKey(
  userId: string,
  key: string,
): Promise<void> {
  await headscaleFetch("/api/v1/preauthkey/expire", {
    body: JSON.stringify({ key, user: userId }),
    method: "POST",
  });
}

export async function listNodes(): Promise<V1Node[]> {
  const json = await headscaleFetch<{ nodes?: V1Node[] }>("/api/v1/node");

  return json.nodes ?? [];
}

export async function listPreAuthKeys(userId: string): Promise<V1PreAuthKey[]> {
  const params = new URLSearchParams({ user: userId });
  const json = await headscaleFetch<{ preAuthKeys?: V1PreAuthKey[] }>(
    `/api/v1/preauthkey?${params}`,
  );

  return json.preAuthKeys ?? [];
}

export async function listUsers(): Promise<V1User[]> {
  const json = await headscaleFetch<{ users?: V1User[] }>("/api/v1/user");

  return json.users ?? [];
}

export async function renameNode(id: string, newName: string): Promise<V1Node> {
  const encoded = encodeURIComponent(newName);
  const json = await headscaleFetch<{ node: V1Node }>(
    `/api/v1/node/${id}/rename/${encoded}`,
    { method: "POST" },
  );

  return json.node;
}

export async function setNodeTags(id: string, tags: string[]): Promise<V1Node> {
  const json = await headscaleFetch<{ node: V1Node }>(
    `/api/v1/node/${id}/tags`,
    { body: JSON.stringify({ tags }), method: "POST" },
  );

  return json.node;
}

async function headscaleFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const baseUrl = process.env.HEADSCALE_BASE_URL;
  const apiKey = process.env.HEADSCALE_API_KEY;

  if (!baseUrl) {
    throw new Error("HEADSCALE_BASE_URL is missing");
  }

  if (!apiKey) {
    throw new Error("HEADSCALE_API_KEY is missing");
  }

  return authedFetch<T>(
    {
      auth: { headerName: "Authorization", value: `Bearer ${apiKey}` },
      baseUrl,
      errorLabel: "Headscale API",
    },
    path,
    init,
  );
}
