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
    ]);
  },

  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },

  reactCompiler: true,

  redirects() {
    return Promise.resolve([
      {
        destination: "https://discord.gg/ZwZd7dFdPz",
        permanent: false,
        source: "/go/discord",
      },
      {
        destination:
          "https://discord.com/oauth2/authorize?client_id=1449784411598880919&permissions=274878024768&integration_type=0&scope=bot+applications.commands",
        permanent: false,
        source: "/go/discord-bot",
      },
      {
        destination: "https://github.com/wowlabdev",
        permanent: false,
        source: "/go/github",
      },
      {
        destination: "https://github.com/wowlabdev/:path*",
        permanent: false,
        source: "/go/github/:path*",
      },
    ]);
  },

  transpilePackages: ["@wowlab/shared"],
};

export default withIntlayer(nextConfig);

if (process.env.NODE_ENV === "development") {
  void initOpenNextCloudflareForDev({
    configPath: "wrangler.local.jsonc",
    persist: false,
  });
}
