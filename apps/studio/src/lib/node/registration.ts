import { parse, SentinelRegisterResponseSchema } from "@/lib/zod";
import { env } from "@wowlab/shared/lib/env";

import { getOrCreateKeypair, signRequest } from "./keys";
import { getAutoWorkerCount } from "./parallelism";

type CommonModule = typeof import("wowlab-common");

export function refreshToken(common: CommonModule): Promise<string> {
  return postSignedSentinel(common, {
    body: "{}",
    errorLabel: "sentinel token refresh",
    path: "/nodes/token",
  });
}

export function registerBrowserNode(
  common: CommonModule,
  tokenClaim: string,
): Promise<string> {
  return postSignedSentinel(common, {
    body: JSON.stringify({
      accessRules: [],
      enabledCores: getAutoWorkerCount(4),
      hostname: window.location.hostname,
      platform: "browser",
      tokenClaim,
      totalCores: navigator.hardwareConcurrency || 1,
      version: "0.1.0",
    }),
    errorLabel: "sentinel",
    path: "/nodes/register",
  });
}

async function postSignedSentinel(
  common: CommonModule,
  options: { body: string; errorLabel: string; path: string },
): Promise<string> {
  const { body, errorLabel, path } = options;
  const { privateKey, publicKey } = getOrCreateKeypair(common);

  const url = new URL(path, env.SENTINEL_URL);
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const signature = signRequest(
    common,
    privateKey,
    timestamp,
    "POST",
    url.host,
    url.pathname,
    body,
  );

  const res = await fetch(url.href, {
    body,
    headers: {
      "Content-Type": "application/json",
      "X-Node-Key": publicKey,
      "X-Node-Sig": signature,
      "X-Node-Ts": timestamp,
    },
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(`${errorLabel} ${res.status}: ${text}`);
  }

  const data = parse(SentinelRegisterResponseSchema, await res.json());

  if (!data) {
    throw new Error(`${errorLabel} returned an invalid response payload`);
  }

  return data.beaconToken;
}
