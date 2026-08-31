import { assertEnv } from "@wowlab/shared/lib/env";

export function register() {
  assertEnv([
    "APP_HOST",
    "APP_URL",
    "BUNNY_STREAM_LIBRARY_ID",
    "CENTRIFUGO_URL",
    "CF_BEACON_TOKEN",
    "CURSEFORGE_MOD_ID",
    "CURSEFORGE_SLUG",
    "IMAGE_ZONE",
    "LANDING_HOST",
    "LANDING_URL",
    "OG_URL",
    "PADDLE_CLIENT_TOKEN",
    "PADDLE_ENV",
    "PADDLE_PRICE_BOOST_PACK",
    "PADDLE_PRICE_GUILD_SLOT",
    "PADDLE_PRICE_INDIVIDUAL",
    "SENTINEL_URL",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_URL",
  ]);
}
