import "server-only";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

import { env } from "@wowlab/shared/lib/env";

const environment =
  env.PADDLE_ENV === "production"
    ? Environment.production
    : Environment.sandbox;

export const paddle = new Paddle(process.env.PADDLE_API_KEY!, { environment });
