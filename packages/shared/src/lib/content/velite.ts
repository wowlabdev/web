import type { Root } from "hast";

import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { toString } from "hast-util-to-string";
import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";
import { promisify } from "node:util";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import { defineCollection, type MdxOptions, type Output, s } from "velite";

// Relative to each app's velite.config.ts.
export const CONTENT_ROOT = "../../packages/shared/src/content";

const execFileAsync = promisify(execFile);

async function sourceTimestamp(path: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", [
      "log",
      "-1",
      "--format=%cI",
      "--",
      path,
    ]);
    const timestamp = stdout.trim();

    if (timestamp) {
      return timestamp;
    }
  } catch {
    // New files have no Git history yet.
  }

  return (await stat(path)).mtime.toISOString();
}

const gitTimestamp = () =>
  s
    .custom<string | undefined>((i) => i === undefined || typeof i === "string")
    .transform<string>(async (_, { meta }) => sourceTimestamp(meta.path));

function rawCodeTransform(tree: Root) {
  visit(tree, "element", (node) => {
    if (node.tagName !== "pre") {
      return;
    }

    const codeEl = node.children.find(
      (c) => c.type === "element" && c.tagName === "code",
    );

    if (codeEl) {
      node.properties.dataRawCode = toString(codeEl);
    }
  });
}

function rehypeRawCode() {
  return rawCodeTransform;
}

const baseSchema = {
  body: s.mdx(),
  description: s.string(),
  dynamic: s.boolean().optional(),
  metadata: s.metadata(),
  raw: s.raw(),
  slug: s.path(),
  title: s.string(),
  toc: s.toc(),
  updatedAt: gitTimestamp(),
};

// docref:start content-system-bible-collection
export const bible = defineCollection({
  name: "BibleEntry",
  pattern: "bible/**/*.mdx",
  schema: s.object({
    ...baseSchema,
    nextSteps: s.array(s.string()).optional(),
    sortKey: s.path(),
  }),
});
// docref:end content-system-bible-collection

export const blog = defineCollection({
  name: "BlogPost",
  pattern: "blog/**/*.mdx",
  schema: s.object({
    ...baseSchema,
    author: s.string().optional(),
    publishedAt: s.isodate(),
    sortKey: s.path(),
    tags: s.array(s.string()).optional(),
  }),
});

export const docs = defineCollection({
  name: "Doc",
  pattern: "docs/**/*.mdx",
  schema: s.object({
    ...baseSchema,
    nextSteps: s.array(s.string()).optional(),
    sortKey: s.path(),
  }),
});

export const legal = defineCollection({
  name: "LegalPage",
  pattern: "legal/**/*.mdx",
  schema: s.object({
    ...baseSchema,
  }),
});

export const mdxConfig = {
  rehypePlugins: [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: { dark: "github-dark-dimmed", light: "github-light" },
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
          transformerNotationFocus(),
        ],
      },
    ],
    rehypeRawCode,
  ],
} satisfies MdxOptions;

export const veliteOutput = {
  assets: "public/static",
  base: "/static/",
  clean: true,
  data: ".velite",
  name: "[name]-[hash:6].[ext]",
} satisfies Partial<Output>;
