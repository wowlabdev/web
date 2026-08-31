import { assertEnv } from "@wowlab/shared/lib/env";

export function register() {
  assertEnv([
    "APP_URL",
    "LANDING_URL",
    "OG_URL",
    "SUPABASE_URL",
    "IMAGE_ZONE",
    "CF_BEACON_TOKEN",
    "BUNNY_STREAM_LIBRARY_ID",
    "CURSEFORGE_MOD_ID",
    "CURSEFORGE_SLUG",
    "PADDLE_ENV",
    "PADDLE_CLIENT_TOKEN",
    "PADDLE_PRICE_INDIVIDUAL",
    "PADDLE_PRICE_GUILD_SLOT",
    "PADDLE_PRICE_BOOST_PACK",
  ]);
}
