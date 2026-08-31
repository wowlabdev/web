import { capitalCase } from "change-case";

export function formatSlug(slug: string): string {
  return capitalCase(slug);
}
