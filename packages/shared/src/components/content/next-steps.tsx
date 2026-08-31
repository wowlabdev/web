import { ArrowRight } from "lucide-react";
import { useIntlayer } from "next-intlayer/server";
import Link from "next/link";

import type { NavItem } from "@wowlab/shared/lib/content/types";

type NextStepsProps = {
  items: NonNullable<NavItem>[];
};

export function NextSteps({ items }: Readonly<NextStepsProps>) {
  const { nextSteps: content } = useIntlayer("article");

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 border-t border-border pt-6">
      <p className="font-semibold mb-3">{content.title}</p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="flex items-center gap-2 text-muted-foreground no-underline hover:text-foreground transition-colors"
          >
            <ArrowRight className="size-4 text-muted-foreground/60" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
