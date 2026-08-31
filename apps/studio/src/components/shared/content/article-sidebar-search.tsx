"use client";

import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { useSearch } from "@/components/shared/islands";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";

export function ArticleSidebarSearch() {
  const { openSearch } = useSearch();
  const { sidebar: content } = useIntlayer("article");

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={openSearch}
      className="w-full justify-between"
    >
      <span className="flex items-center gap-2">
        <SearchIcon className="size-3.5" />
        <span className="text-xs">{content.search}</span>
      </span>
      <Badge variant="outline" className="text-[10px] px-1 py-0">
        ⌘K
      </Badge>
    </Button>
  );
}
