import type { MetadataRoute } from "next";

import { landingUrl, routes } from "@wowlab/shared/lib/routing";
import { collectRoutes } from "@wowlab/shared/lib/routing/nav";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = landingUrl("/sitemap.xml");

  return {
    host: new URL(sitemapUrl).host,
    rules: {
      allow: "/",
      disallow: disallowedPaths(),
      userAgent: "*",
    },
    sitemap: sitemapUrl,
  };
}

function disallowedPaths(): string[] {
  const paths = collectRoutes(routes)
    .filter((r) => !r.isSearchable && !r.isExternal)
    .map((r) => r.path)
    .sort((a, b) => a.length - b.length);

  return paths.filter(
    (path, _, all) => !all.some((p) => p !== path && path.startsWith(`${p}/`)),
  );
}
