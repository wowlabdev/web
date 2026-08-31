import { defineConfig } from "velite";

import { llmsTxt, rssFeed } from "@wowlab/shared/lib/content/hooks";
import {
  bible,
  blog,
  CONTENT_ROOT,
  docs,
  legal,
  mdxConfig,
  veliteOutput,
} from "@wowlab/shared/lib/content/velite";

const STUDIO_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.wowlab.gg";
const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? "https://wowlab.gg";

export default defineConfig({
  collections: { bible, blog, docs, legal },
  mdx: mdxConfig,
  output: veliteOutput,
  prepare: ({ bible, blog, docs }) => {
    llmsTxt(LANDING_URL)
      .section("Documentation", `${STUDIO_URL}/dev/docs`, docs)
      .section("Bible", `${STUDIO_URL}/dev/bible`, bible)
      .section("Blog", `${LANDING_URL}/blog`, blog, (p) =>
        p.slug.replace(/^blog\//, ""),
      )
      .write();

    rssFeed(blog, LANDING_URL);
  },
  root: CONTENT_ROOT,
});
