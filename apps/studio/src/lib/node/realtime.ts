import type { z } from "zod";

import { Centrifuge } from "centrifuge";

import { ChunkPayloadSchema, parse } from "@/lib/zod";
import { env } from "@wowlab/shared/lib/env";

import { getPublicKeyBase64 } from "./keys";
import { refreshToken } from "./registration";

export type ChunkPayload = z.infer<typeof ChunkPayloadSchema>;

type ChunkHandler = (chunk: ChunkPayload) => void;
type CommonModule = typeof import("wowlab-common");

type LogFn = (msg: string) => void;

let client: Centrifuge | null = null;

type ConnectOptions = {
  beaconToken: string;
  common: CommonModule;
  log?: LogFn;
  onChunk: ChunkHandler;
};

export function connectToBeacon({
  beaconToken,
  common,
  log,
  onChunk,
}: ConnectOptions): () => void {
  const publicKey = getPublicKeyBase64();

  if (!publicKey) {
    log?.("No keypair found, cannot connect to beacon");

    return () => {};
  }

  const wsUrl = new URL("connection/websocket", env.CENTRIFUGO_URL).href;

  log?.(`WS URL: ${wsUrl}`);

  if (client) {
    log?.("Existing beacon client found, disconnecting before reconnect");
    client.disconnect();
    client = null;
  }

  const currentClient = new Centrifuge(wsUrl, {
    getToken: () => refreshToken(common),
    token: beaconToken,
  });

  client = currentClient;

  const chunksChannel = `chunks:${publicKey}`;

  log?.(`Subscribing to ${chunksChannel}`);
  const chunksSub = currentClient.newSubscription(chunksChannel);

  chunksSub.on("publication", (ctx) => {
    log?.(`Raw publication: ${JSON.stringify(ctx.data)}`);
    const chunk = parse(ChunkPayloadSchema, ctx.data);

    if (!chunk) {
      log?.("Invalid chunk payload received; ignoring publication");

      return;
    }

    onChunk(chunk);
  });

  chunksSub.on("subscribing", (ctx) => {
    log?.(`[chunks] Subscribing: code=${ctx.code} reason=${ctx.reason}`);
  });

  chunksSub.on("subscribed", (ctx) => {
    log?.(
      `[chunks] Subscribed: channel=${ctx.channel} recoverable=${ctx.recoverable}`,
    );
  });

  chunksSub.on("error", (ctx) => {
    log?.(`[chunks] Error: ${JSON.stringify(ctx)}`);
  });

  log?.("Subscribing to nodes:online (presence)");
  const presenceSub = currentClient.newSubscription("nodes:online", {
    joinLeave: true,
  });

  presenceSub.on("subscribing", (ctx) => {
    log?.(`[presence] Subscribing: code=${ctx.code} reason=${ctx.reason}`);
  });

  presenceSub.on("subscribed", (ctx) => {
    log?.(`[presence] Subscribed: channel=${ctx.channel}`);
  });

  presenceSub.on("join", (ctx) => {
    log?.(`[presence] Join: client=${ctx.info.client}`);
  });

  presenceSub.on("leave", (ctx) => {
    log?.(`[presence] Leave: client=${ctx.info.client}`);
  });

  presenceSub.on("error", (ctx) => {
    log?.(`[presence] Error: ${JSON.stringify(ctx)}`);
  });

  currentClient.on("connected", (ctx) => {
    log?.(
      `Centrifuge connected: client=${ctx.client} transport=${ctx.transport}`,
    );
  });

  currentClient.on("connecting", (ctx) => {
    log?.(`Centrifuge connecting: code=${ctx.code} reason=${ctx.reason}`);
  });

  currentClient.on("disconnected", (ctx) => {
    log?.(`Centrifuge disconnected: code=${ctx.code} reason=${ctx.reason}`);
  });

  chunksSub.subscribe();
  presenceSub.subscribe();
  currentClient.connect();

  return () => {
    chunksSub.unsubscribe();
    presenceSub.unsubscribe();
    currentClient.disconnect();

    if (client === currentClient) {
      client = null;
    }
  };
}
