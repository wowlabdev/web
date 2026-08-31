import { defineConfig } from "velite";
import { fs, path } from "zx";

import { toSlug } from "@wowlab/shared/lib/content/paths";
import {
  bible,
  CONTENT_ROOT,
  docs,
  mdxConfig,
  veliteOutput,
} from "@wowlab/shared/lib/content/velite";

type ContentMetadata = {
  description: string;
  sortKey: string;
  title: string;
  updatedAt: string;
};

function metadata(entries: ContentMetadata[], prefix: string) {
  return entries
    .map(({ description, sortKey, title, updatedAt }) => ({
      description,
      slug: toSlug(sortKey, prefix),
      title,
      updatedAt,
    }))
    .toSorted((left, right) => left.slug.localeCompare(right.slug));
}

export default defineConfig({
  collections: { bible, docs },
  complete: async (data, { config }) => {
    await fs.outputJson(path.join(config.output.data, "content-index.json"), {
      bible: metadata(data.bible, "bible"),
      docs: metadata(data.docs, "docs"),
    });
  },
  mdx: mdxConfig,
  output: veliteOutput,
  root: CONTENT_ROOT,
});
