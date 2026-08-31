import type { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { withIntlayer } from "next-intlayer/server";

const nextConfig: NextConfig = {
  agentRules: false,

  deploymentId: process.env.CF_DEPLOY_ID,

  experimental: {
    authInterrupts: true,
    cpus: 12,
    turbopackFileSystemCacheForDev: true,
  },

  headers() {
    return Promise.resolve([
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        source: "/wasm/:path*.wasm",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
        source: "/wasm/manifest.json",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
        source: "/preview/:path*",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
        source: "/:locale/preview/:path*",
      },
      {
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
        source: "/:locale/preview/:path*",
      },
      {
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
        source: "/preview/:path*",
      },
    ]);
  },

  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },

  reactCompiler: true,

  redirects() {
    return Promise.resolve([]);
  },

  transpilePackages: ["@wowlab/shared", "shiki"],

  turbopack: {
    rules: {
      "*.eta": {
        as: "*.js",
        loaders: ["raw-loader"],
      },
    },
  },
};

export default withIntlayer(nextConfig);

if (process.env.NODE_ENV === "development") {
  void initOpenNextCloudflareForDev({
    configPath: "wrangler.local.jsonc",
    persist: false,
  });
}
