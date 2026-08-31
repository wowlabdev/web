import "@supabase/functions-js/edge-runtime.d.ts";

import { options, text } from "../_shared/response.ts";

const WOWHEAD_BASE = "https://wow.zamimg.com/images/wow/icons";
const VALID_SIZES = new Set(["large", "medium", "small"]);
const ICON_FILENAME = /^[a-z0-9_-]+\.jpg$/;
const UPSTREAM_TIMEOUT_MS = 10_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return options();
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      headers: { Allow: "GET" },
      status: 405,
    });
  }

  const url = new URL(req.url);
  const { pathname } = url;
  const pathParts = pathname.split("/").filter(Boolean);
  const size = pathParts[1];
  const filename = pathParts[2];

  if (!size || !filename || pathParts.length !== 3) {
    return text("Invalid icon path", 400);
  }

  if (!VALID_SIZES.has(size)) {
    return text("Invalid size. Use: small, medium, or large", 400);
  }

  if (!ICON_FILENAME.test(filename)) {
    return text("Invalid icon filename", 400);
  }

  try {
    const iconUrl = `${WOWHEAD_BASE}/${size}/${filename}`;
    const response = await fetch(iconUrl, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!response.ok) {
      return text("Icon not found", 404);
    }

    return new Response(response.body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "image/jpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to fetch icon", error);

    return text("Failed to fetch icon", 502);
  }
});
