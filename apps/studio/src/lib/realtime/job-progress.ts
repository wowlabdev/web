"use client";

import type { z } from "zod";

import { Centrifuge, UnauthorizedError } from "centrifuge";
import { useEffect, useState } from "react";

import {
  JobProgressEventSchema,
  JobProgressTokenResponseSchema,
  parse,
} from "@/lib/zod";
import { env } from "@wowlab/shared/lib/env";

export type JobProgressPayload = z.infer<
  typeof JobProgressEventSchema
>["payload"];

type SubscribeOptions = {
  jobId: string;
  onError: () => void;
  onProgress: (payload: JobProgressPayload) => void;
};

type TokenResponse = z.infer<typeof JobProgressTokenResponseSchema>;

type UseJobProgressOptions = {
  isEnabled: boolean;
};

type UseJobProgressResult = {
  isFailed: boolean;
  progress: JobProgressPayload | null;
};

// Tokens come from an ownership-checked server route; the browser never sees the HMAC secret.
export function subscribeToJobProgress({
  jobId,
  onError,
  onProgress,
}: SubscribeOptions): () => void {
  const wsUrl = new URL("connection/websocket", env.CENTRIFUGO_URL).href;
  const channel = `jobs:${jobId}`;

  const client = new Centrifuge(wsUrl, {
    getToken: async () => {
      const tokens = await fetchJobTokens(jobId);

      return tokens.connectionToken;
    },
  });

  client.on("error", () => {
    onError();
  });

  const sub = client.newSubscription(channel, {
    getToken: async () => {
      const tokens = await fetchJobTokens(jobId);

      return tokens.subscriptionToken;
    },
  });

  sub.on("publication", (ctx) => {
    const event = parse(JobProgressEventSchema, ctx.data);

    if (!event) {
      return;
    }

    onProgress(event.payload);
  });

  sub.on("error", () => {
    onError();
  });

  sub.subscribe();
  client.connect();

  return () => {
    sub.unsubscribe();
    client.disconnect();
  };
}

// isFailed lets callers fall back to polling when the realtime channel dies.
export function useJobProgress(
  jobId: string,
  { isEnabled }: UseJobProgressOptions,
): UseJobProgressResult {
  const [progress, setProgress] = useState<JobProgressPayload | null>(null);

  // Per-job so a new job id implicitly clears the failed flag without a setState in the effect.
  const [failedJobId, setFailedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isActive = true;

    const teardown = subscribeToJobProgress({
      jobId,
      onError: () => {
        if (isActive) {
          setFailedJobId(jobId);
        }
      },
      onProgress: (payload) => {
        if (isActive) {
          setProgress(payload);
        }
      },
    });

    return () => {
      isActive = false;
      teardown();
    };
  }, [isEnabled, jobId]);

  return { isFailed: failedJobId === jobId, progress };
}

async function fetchJobTokens(jobId: string): Promise<TokenResponse> {
  const res = await fetch(
    `/api/realtime/job-token?jobId=${encodeURIComponent(jobId)}`,
    { cache: "no-store" },
  );

  if (res.status === 401 || res.status === 404) {
    throw new UnauthorizedError("not authorized for job channel");
  }

  if (!res.ok) {
    throw new Error(`job token request failed: ${res.status}`);
  }

  const tokens = parse(JobProgressTokenResponseSchema, await res.json());

  if (!tokens) {
    throw new Error("job token response was invalid");
  }

  return tokens;
}
