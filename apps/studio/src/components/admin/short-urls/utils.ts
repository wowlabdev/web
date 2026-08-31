import { landingUrl } from "@wowlab/shared/lib/routing/utils";

export const SHORT_URL_SEARCH_KEYS = [
  "slug",
  "short_url",
  "target_url",
] as const;

export function buildShortUrlFromSlug(slug: string) {
  return landingUrl(`/go/${slug}`);
}
