"use client";

import type { ComponentProps } from "react";

import { useLocale } from "next-intlayer";
import NextLink from "next/link";

import { getLocalizedUrl } from "@wowlab/shared/lib/routing";

const isExternal = (href?: string) => /^https?:\/\//.test(href ?? "");
const isHashOnly = (href?: string) => href?.startsWith("#") ?? false;

export type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ href, ...props }: LinkProps) {
  const { locale } = useLocale();
  const hrefString = href.toString();
  const shouldLocalize =
    href && !isExternal(hrefString) && !isHashOnly(hrefString);
  const localizedHref = shouldLocalize
    ? getLocalizedUrl(hrefString, locale)
    : href;

  return <NextLink href={localizedHref} {...props} />;
}
