"use client";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { cn } from "@wowlab/shared/lib/utils";

import type { CategoryWithMatches } from "./use-api-docs-state";

type CategorySidebarProps = {
  active: string;
  categories: CategoryWithMatches[];
  isSearching: boolean;
  onSelect: (id: string) => void;
};

export function CategorySidebar({
  active,
  categories,
  isSearching,
  onSelect,
}: Readonly<CategorySidebarProps>) {
  return (
    <nav
      className={cn(
        "flex gap-1 overflow-x-auto pb-1",
        "md:flex-col md:gap-0.5 md:overflow-visible md:pb-0",
      )}
    >
      {categories.map((category) => {
        const isActive = category.id === active;
        const dim = isSearching && category.matches === 0;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
              "md:shrink",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              dim && !isActive && "opacity-50",
            )}
          >
            <span className="flex-1 whitespace-nowrap">{category.label}</span>
            <Badge variant="outline" className="text-[10px]">
              {isSearching ? category.matches : category.count}
            </Badge>
          </button>
        );
      })}
    </nav>
  );
}
