"use client";

import { useBoolean } from "ahooks";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { ContentSection } from "@wowlab/shared/lib/content";
import type { DynamicRoute } from "@wowlab/shared/lib/routing/types";

import { Link } from "@wowlab/shared/components/ui/link";
import { href } from "@wowlab/shared/lib/routing";
import { cn } from "@wowlab/shared/lib/utils";

import { SidebarSectionLabel } from "./article-sidebar-section-label";

export function ArticleSidebarNavigation({
  currentSlug,
  items,
  pageRoute,
}: Readonly<{
  items: ContentSection[];
  currentSlug: string;
  pageRoute: DynamicRoute;
}>) {
  const { sidebar: content } = useIntlayer("article");

  return (
    <div>
      <SidebarSectionLabel>{content.navigation}</SidebarSectionLabel>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          if (item.children) {
            const containsActive = item.children.some(
              (child) => child.slug === currentSlug,
            );

            return (
              <NavGroup
                key={item.slug}
                item={item}
                currentSlug={currentSlug}
                isDefaultOpen={containsActive}
                pageRoute={pageRoute}
              />
            );
          }

          const isActive = item.slug === currentSlug;

          return (
            <Link
              key={item.slug}
              href={href(pageRoute, { slug: item.slug })}
              className={cn(
                "py-0.5 text-xs no-underline transition-colors",
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function NavGroup({
  currentSlug,
  isDefaultOpen,
  item,
  pageRoute,
}: Readonly<{
  item: ContentSection;
  currentSlug: string;
  isDefaultOpen: boolean;
  pageRoute: DynamicRoute;
}>) {
  const [isOpen, { toggle: toggleOpen }] = useBoolean(isDefaultOpen);

  if (!item.children) {
    return null;
  }

  return (
    <div>
      <button
        className="flex w-full items-center gap-1 bg-transparent py-0.5 text-muted-foreground transition-colors hover:text-foreground"
        onClick={toggleOpen}
      >
        {isOpen ? (
          <ChevronDown className="size-3" />
        ) : (
          <ChevronRight className="size-3" />
        )}
        <span className="text-xs font-medium">{item.title}</span>
      </button>
      {isOpen && (
        <div className="mt-1 flex flex-col gap-0.5 pl-4">
          {item.children.map((child) => {
            const isActive = child.slug === currentSlug;

            return (
              <Link
                key={child.slug}
                href={href(pageRoute, { slug: child.slug })}
                className={cn(
                  "py-0.5 text-xs no-underline transition-colors",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
