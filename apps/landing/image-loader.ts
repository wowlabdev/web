import type { ImageLoaderProps } from "next/image";

import { makeCdnImageUrl } from "@wowlab/shared/lib/links";

export default function cloudflareLoader({
  quality,
  src,
  width,
}: ImageLoaderProps): string {
  const optimized = makeCdnImageUrl(src, { quality, width });

  if (optimized !== src) {
    return optimized;
  }

  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}width=${width}&quality=${quality ?? 75}`;
}
