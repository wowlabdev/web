"use client";

import { useKeyPress } from "ahooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { NavItem } from "@wowlab/shared/lib/content/types";

import { Link } from "@wowlab/shared/components/ui/link";
import { useLocalizedRouter } from "@wowlab/shared/lib/routing";

type ContentNavProps = {
  prev: NavItem;
  next: NavItem;
  shouldShowSubtitle?: boolean;
};

export function ContentNav({
  next,
  prev,
  shouldShowSubtitle = false,
}: Readonly<ContentNavProps>) {
  const router = useLocalizedRouter();
  const { contentNav: content } = useIntlayer("article");

  useKeyPress("leftarrow", () => prev && router.push(prev.href));
  useKeyPress("rightarrow", () => next && router.push(next.href));

  return (
    <nav className="mt-12 flex justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="flex items-center gap-2 text-muted-foreground no-underline hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          {shouldShowSubtitle ? (
            <div className="flex flex-col items-start gap-0">
              <span className="text-xs text-muted-foreground/60">
                {content.previous}
              </span>
              <span className="font-medium">{prev.title}</span>
            </div>
          ) : (
            <span>{prev.title}</span>
          )}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-2 text-muted-foreground no-underline hover:text-foreground transition-colors text-right"
        >
          {shouldShowSubtitle ? (
            <div className="flex flex-col items-end gap-0">
              <span className="text-xs text-muted-foreground/60">
                {content.next}
              </span>
              <span className="font-medium">{next.title}</span>
            </div>
          ) : (
            <span>{next.title}</span>
          )}
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
