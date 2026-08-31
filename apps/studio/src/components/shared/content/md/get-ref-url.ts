import { hasDoi, hasUrl, type Reference } from "@/content/references";

export function getRefUrl(ref: Reference): string | undefined {
  if (hasDoi(ref)) {
    return `https://doi.org/${ref.doi}`;
  }

  if (hasUrl(ref)) {
    return ref.url;
  }

  return undefined;
}
