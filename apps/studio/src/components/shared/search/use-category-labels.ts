"use client";

import { useIntlayer } from "next-intlayer";

import type { FilterKey } from "./filters";

export function useCategoryLabels(): Record<FilterKey, string> {
  const content = useIntlayer("search");

  return {
    Bible: content.categoryBible.value,
    Blog: content.categoryBlog.value,
    Docs: content.categoryDocs.value,
    Items: content.categoryItems.value,
    Pages: content.categoryPages.value,
    Spells: content.categorySpells.value,
  };
}
