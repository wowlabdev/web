"use client";

import { useBoolean } from "ahooks";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { ContentSection } from "@wowlab/shared/lib/content";
import type { DynamicRoute } from "@wowlab/shared/lib/routing/types";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Link } from "@wowlab/shared/components/ui/link";
import { href } from "@wowlab/shared/lib/routing";
import { cn } from "@wowlab/shared/lib/utils";

type ContentTreeProps = {
  items: ContentSection[];
  pageRoute: DynamicRoute;
  activeSlug?: string;
};

export function ContentTree({
  activeSlug,
  items,
  pageRoute,
}: Readonly<ContentTreeProps>) {
  const sections = items.filter((item) => item.children);

  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <TreeSection
          key={section.slug}
          section={section}
          pageRoute={pageRoute}
          activeSlug={activeSlug}
        />
      ))}
    </div>
  );
}

function TreeLink({
  isActive,
  item,
  pageRoute,
}: Readonly<{
  item: ContentSection;
  isActive: boolean;
  pageRoute: DynamicRoute;
}>) {
  return (
    <Link href={href(pageRoute, { slug: item.slug })} className="no-underline">
      <div
        className={cn(
          "flex items-center gap-3 rounded-none px-3 py-1.5 transition-colors",
          isActive
            ? "bg-amber-500/10 text-foreground"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        )}
      >
        <span className="w-3 text-right font-mono text-xs tabular-nums text-muted-foreground/60">
          {item.order + 1}
        </span>
        <span className="text-sm">{item.title}</span>
      </div>
    </Link>
  );
}

function TreeSection({
  activeSlug,
  pageRoute,
  section,
}: Readonly<{
  section: ContentSection;
  pageRoute: DynamicRoute;
  activeSlug?: string;
}>) {
  const count = section.children?.length ?? 0;
  const defaultOpen = section.children?.some((c) => c.slug === activeSlug);
  const [isOpen, { toggle: toggleOpen }] = useBoolean(defaultOpen ?? false);

  return (
    <div className="border-t border-border last:border-b">
      <button
        onClick={toggleOpen}
        className="flex w-full items-center gap-3 bg-transparent py-3 text-left"
      >
        <div className="flex flex-1 items-center gap-3">
          <span className="font-semibold">{section.title}</span>
          <Badge variant="outline">{count}</Badge>
        </div>
        {isOpen ? (
          <ChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col gap-0.5 pb-3">
          {section.children?.map((child) => (
            <TreeLink
              key={child.slug}
              item={child}
              pageRoute={pageRoute}
              isActive={child.slug === activeSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
