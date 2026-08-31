import { decodeHTML } from "entities";
import { Feed } from "feed";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { toSlug } from "@wowlab/shared/lib/content/paths";

const SITE_NAME = "WoW Lab";
const SITE_DESCRIPTION =
  "Simulation and theorycrafting tools for World of Warcraft";

type LlmsEntry = {
  description: string;
  dynamic?: boolean;
  raw: string;
  sortKey: string;
  title: string;
};

type Section = {
  baseUrl: string;
  entries: LlmsEntry[];
  id: string;
  label: string;
  slugOf: (entry: LlmsEntry) => string;
};

const heading = (level: number, text: string) => `${"#".repeat(level)} ${text}`;
const quote = (text: string) => `> ${text}`;
const link = (text: string, href: string) => `[${text}](${href})`;
const code = (text: string) => `\`${text}\``;
const italic = (text: string) => `_${text}_`;
const comment = (text: string) => `<!-- ${text} -->`;

class Doc {
  private blocks: string[] = [];

  add(...blocks: string[]) {
    this.blocks.push(...blocks);

    return this;
  }

  toString() {
    return `${this.blocks.join("\n\n")}\n`;
  }
}

const sorted = (entries: LlmsEntry[]) =>
  [...entries].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

const stripLeadingTitle = (raw: string, title: string) => {
  const body = raw.replace(/^\s+/, "");
  const newline = body.indexOf("\n");
  const first = newline === -1 ? body : body.slice(0, newline);

  let hashes = 0;

  while (first[hashes] === "#") {
    hashes += 1;
  }

  const isTitleHeading =
    hashes >= 1 &&
    hashes <= 6 &&
    first[hashes] === " " &&
    first.slice(hashes + 1).trim() === title;

  if (!isTitleHeading) {
    return body;
  }

  return newline === -1 ? "" : body.slice(newline + 1).replace(/^\s+/, "");
};

const intro = (fullUrl: string) =>
  quote(
    `Every page below is bundled in full into ${link("llms-full.txt", fullUrl)} on this host. ` +
      "Fetch that single file instead of following each link. " +
      "To pull out one page, run the `sed` command on its entry, or search the file for that page's `<!-- page:ID -->` marker. " +
      "Entries marked `(dynamic)` have no static text, so open their link instead. " +
      "Each link points to where the page is rendered and canonical.",
  );

const renderPage = (section: Section, entry: LlmsEntry) => {
  const slug = section.slugOf(entry);
  const id = `${section.id}/${slug}`;
  const url = `${section.baseUrl}/${slug}`;
  const open = comment(`page:${id}`);
  const close = comment(`/page:${id}`);
  const head = heading(2, entry.title);

  if (entry.dynamic) {
    const body = italic(
      `Dynamic page: content is rendered live at ${url} and is not included here.`,
    );

    return {
      block: [open, head, body, close].join("\n\n"),
      note: "(dynamic, see the linked page)",
      url,
    };
  }

  const sed = String.raw`sed -n '\%${open}%,\%${close}%p' llms-full.txt`;

  return {
    block: [
      open,
      head,
      decodeHTML(stripLeadingTitle(entry.raw, entry.title)),
      close,
    ].join("\n\n"),
    note: `(full text: ${code(sed)})`,
    url,
  };
};

class LlmsTxtBuilder {
  private sections: Section[] = [];
  private readonly siteUrl: string;

  constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
  }

  section<T extends LlmsEntry>(
    label: string,
    baseUrl: string,
    entries: T[],
    slugOf?: (entry: T) => string,
  ) {
    const prefix = entries[0]?.sortKey.split("/")[0] ?? "";

    this.sections.push({
      baseUrl,
      entries,
      id: label.toLowerCase().replaceAll(/\s+/g, "-"),
      label,
      slugOf: (slugOf ?? ((e: T) => toSlug(e.sortKey, prefix))) as (
        entry: LlmsEntry,
      ) => string,
    });

    return this;
  }

  write() {
    const index = new Doc().add(
      heading(1, SITE_NAME),
      quote(SITE_DESCRIPTION),
      intro(`${this.siteUrl}/llms-full.txt`),
    );
    const full = new Doc().add(heading(1, SITE_NAME), quote(SITE_DESCRIPTION));

    for (const section of this.sections) {
      index.add(heading(2, section.label));
      full.add(heading(1, section.label));

      const bullets: string[] = [];

      for (const entry of sorted(section.entries)) {
        const page = renderPage(section, entry);

        full.add(page.block);
        bullets.push(
          `- ${link(entry.title, page.url)}: ${entry.description} ${page.note}`,
        );
      }

      index.add(bullets.join("\n"));
    }

    writeFileSync(join("public", "llms.txt"), index.toString());
    writeFileSync(join("public", "llms-full.txt"), full.toString());
  }
}

export const llmsTxt = (siteUrl: string) => new LlmsTxtBuilder(siteUrl);

export function rssFeed<
  T extends {
    author?: string;
    description: string;
    publishedAt: string;
    slug: string;
    title: string;
  },
>(posts: T[], siteUrl: string) {
  const feed = new Feed({
    author: { name: SITE_NAME },
    copyright: `© ${new Date().getFullYear()} ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    id: siteUrl,
    link: siteUrl,
    title: SITE_NAME,
  });

  const byDate = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  for (const post of byDate) {
    const slug = post.slug.replace(/^blog\//, "");

    feed.addItem({
      author: post.author ? [{ name: post.author }] : undefined,
      date: new Date(post.publishedAt),
      description: post.description,
      id: `${siteUrl}/blog/${slug}`,
      link: `${siteUrl}/blog/${slug}`,
      title: post.title,
    });
  }

  const dir = join("public", "blog");

  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "feed.xml"), feed.rss2());
}
