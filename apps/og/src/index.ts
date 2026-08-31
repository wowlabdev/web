import { cache } from "@cf-wasm/og/workerd";

import { type OgEnv, type OgInput, renderOgImage } from "./image";

const OG_CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

const FIELD_LIMITS = {
  author: 120,
  date: 120,
  description: 2000,
  section: 160,
  tag: 120,
  title: 500,
} as const;

class InvalidRequest extends Error {}

function canonicalOgUrl(input: OgInput): string {
  const url = new URL("https://og.wowlab.gg/");

  url.searchParams.set("description", input.description);
  url.searchParams.set("section", input.section);

  if (input.type === "article") {
    url.searchParams.set("type", "article");
    url.searchParams.set("title", input.title);

    for (const field of ["author", "date", "tag"] as const) {
      const value = input[field];

      if (value) {
        url.searchParams.set(field, value);
      }
    }
  }

  url.searchParams.sort();

  return url.toString();
}

function ogHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": OG_CACHE_CONTROL,
    "Content-Type": "image/png",
    "X-Content-Type-Options": "nosniff",
  };
}

async function ogObjectKey(canonicalUrl: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalUrl),
  );
  const hex = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `og/${hex}.png`;
}

function optionalField(
  params: URLSearchParams,
  name: keyof typeof FIELD_LIMITS,
): string | undefined {
  const value = params.get(name)?.trim();

  if (!value) {
    return undefined;
  }

  if (value.length > FIELD_LIMITS[name]) {
    throw new InvalidRequest(`${name} is too long`);
  }

  return value;
}

function parseOgInput(url: URL): OgInput {
  const type =
    url.searchParams.get("type") === "article" ? "article" : "section";
  const description = requiredField(url.searchParams, "description", "");
  const section = requiredField(url.searchParams, "section", "WoW Lab");

  if (type === "article") {
    return {
      author: optionalField(url.searchParams, "author"),
      date: optionalField(url.searchParams, "date"),
      description,
      section,
      tag: optionalField(url.searchParams, "tag"),
      title: requiredField(url.searchParams, "title", ""),
      type,
    };
  }

  return { description, section, type };
}

function requiredField(
  params: URLSearchParams,
  name: keyof typeof FIELD_LIMITS,
  fallback: string,
): string {
  return optionalField(params, name) ?? fallback;
}

export default {
  async fetch(
    request: Request,
    env: OgEnv,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method !== "GET") {
      return new Response("Method not allowed", {
        headers: { Allow: "GET" },
        status: 405,
      });
    }

    cache.setExecutionContext(ctx);

    try {
      const input = parseOgInput(new URL(request.url));
      const canonicalUrl = canonicalOgUrl(input);
      const cacheKey = new Request(canonicalUrl);
      const edge = caches.default;
      const cached = await edge.match(cacheKey);

      if (cached) {
        return cached;
      }

      const objectKey = await ogObjectKey(canonicalUrl);
      const stored = await env.OG_BUCKET.get(objectKey);

      if (stored) {
        const response = new Response(stored.body, { headers: ogHeaders() });

        ctx.waitUntil(edge.put(cacheKey, response.clone()));

        return response;
      }

      const rateLimit = await env.OG_RATE_LIMITER.limit({
        key: request.headers.get("CF-Connecting-IP") ?? "unknown",
      });

      if (!rateLimit.success) {
        return new Response("Too many requests", {
          headers: { "Retry-After": "60" },
          status: 429,
        });
      }

      const body = await renderOgImage(env, input);
      const response = new Response(body, { headers: ogHeaders() });

      ctx.waitUntil(
        Promise.all([
          env.OG_BUCKET.put(objectKey, body, {
            httpMetadata: {
              cacheControl: OG_CACHE_CONTROL,
              contentType: "image/png",
            },
          }),
          edge.put(cacheKey, response.clone()),
        ]),
      );

      return response;
    } catch (error) {
      if (error instanceof InvalidRequest) {
        return new Response(error.message, { status: 400 });
      }

      console.error("Failed to generate OG image", error);

      return new Response("Failed to generate the image", { status: 500 });
    }
  },
};
