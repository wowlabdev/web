import type { LocalesValues } from "intlayer";
import type { Metadata } from "next";

import { date } from "intlayer";

import { makeOgImageUrl } from "@wowlab/shared/lib/links";
import {
  type DynamicRoute,
  href,
  type Route,
} from "@wowlab/shared/lib/routing";

import { ogLocale } from "./locales";
import { canonicalUrl, languageAlternates, type SeoHost } from "./urls";

export const SITE_NAME = "WoW Lab";

export const DEFAULT_DESCRIPTION = "Source-available WoW theorycrafting tools";

type Article = {
  authors?: string[];
  modifiedTime?: string;
  publishedTime?: string;
};
type ArticleBase = {
  route: DynamicRoute;
  parent: Route;
  params: Record<string, string>;
  title: string;
  description: string;
} & Base;
type Base = { host: SeoHost; locale: string };

type Images = { alt: string; height: number; url: string; width: number }[];

const OG_SIZE = { height: 630, width: 1200 };

export function articleMetadata(
  args: { updatedAt: string } & ArticleBase,
): Metadata {
  return build({
    article: { modifiedTime: args.updatedAt },
    description: args.description,
    host: args.host,
    images: ogImages(
      args.title,
      makeOgImageUrl({
        description: args.description,
        section: args.parent.label,
        title: args.title,
      }),
    ),
    locale: args.locale,
    path: href(args.route, args.params),
    title: args.title,
  });
}

export function blogPostMetadata(
  args: {
    publishedAt: string;
    author?: string;
    tag?: string;
  } & ArticleBase,
): Metadata {
  return build({
    article: {
      authors: args.author ? [args.author] : undefined,
      publishedTime: args.publishedAt,
    },
    description: args.description,
    host: args.host,
    images: ogImages(
      args.title,
      makeOgImageUrl({
        author: args.author,
        date: date(args.publishedAt, {
          dateStyle: "long",
          locale: args.locale as LocalesValues,
        }),
        description: args.description,
        section: args.parent.label,
        tag: args.tag,
        title: args.title,
      }),
    ),
    locale: args.locale,
    path: href(args.route, args.params),
    title: args.title,
  });
}

export function sectionMetadata(
  args: { route: Route; title?: string; description?: string } & Base,
): Metadata {
  const title = args.title ?? args.route.label;
  const description = args.description ?? args.route.description;

  return build({
    description,
    host: args.host,
    images: ogImages(
      title === SITE_NAME ? SITE_NAME : `${SITE_NAME} ${title}`,
      makeOgImageUrl({ description, section: title }),
    ),
    locale: args.locale,
    path: href(args.route),
    title,
  });
}

function build(
  args: {
    path: string;
    title: string;
    description: string;
    images: Images;
    article?: Article;
  } & Base,
): Metadata {
  const url = canonicalUrl(args.host, args.locale, args.path);

  return {
    alternates: {
      canonical: url,
      languages: languageAlternates(args.host, args.path),
    },
    description: args.description,
    openGraph: {
      description: args.description,
      images: args.images,
      locale: ogLocale(args.locale),
      siteName: SITE_NAME,
      title: args.title,
      type: args.article ? "article" : "website",
      url,
      ...args.article,
    },
    robots: { follow: true, index: true },
    title: args.title,
    twitter: {
      card: "summary_large_image",
      description: args.description,
      images: args.images,
      title: args.title,
    },
  };
}

function ogImages(alt: string, url: string): Images {
  return [{ alt, height: OG_SIZE.height, url, width: OG_SIZE.width }];
}
