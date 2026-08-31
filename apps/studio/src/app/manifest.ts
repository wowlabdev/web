import type { MetadataRoute } from "next";

import { DEFAULT_DESCRIPTION, SITE_NAME } from "@wowlab/shared/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#1a181f",
    description: DEFAULT_DESCRIPTION,
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "/web-app-manifest-192x192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/web-app-manifest-512x512.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/web-app-manifest-512x512.png",
        type: "image/png",
      },
    ],
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: "/",
    theme_color: "#1a181f",
  };
}
