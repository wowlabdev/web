import type { ImageLoaderProps } from "next/image";

import { makeCdnImageUrl } from "@wowlab/shared/lib/links";

export default function cloudflareLoader({
  quality,
  src,
  width,
}: ImageLoaderProps): string {
  const url = makeCdnImageUrl(src, { quality, width });

  if (url !== src || process.env.NODE_ENV !== "development") {
    return url;
  }

  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}__next_width=${width}`;
}
