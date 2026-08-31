import {
  BookOpenIcon,
  BrainCircuitIcon,
  CpuIcon,
  DatabaseIcon,
  GlobeIcon,
  LayoutIcon,
  ScrollIcon,
  SwordsIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer/server";
import Link from "next/link";

import { bible } from "@/lib/content/bible";
import { Avatar, AvatarFallback } from "@wowlab/shared/components/ui/avatar";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { DEFAULT_SECTION_COLORS } from "@wowlab/shared/lib/content";
import { href, routes } from "@wowlab/shared/lib/routing";
import { cn } from "@wowlab/shared/lib/utils";
const SECTION_ICONS: Record<string, typeof BookOpenIcon> = {
  compendium: SwordsIcon,
  "game-data": DatabaseIcon,
  infrastructure: GlobeIcon,
  mechanics: BrainCircuitIcon,
  overview: BookOpenIcon,
  portal: LayoutIcon,
  simulation: CpuIcon,
};
const SECTION_COLORS: Record<
  string,
  {
    avatar: string;
    border: string;
    text: string;
  }
> = {
  compendium: {
    avatar: "bg-red-500/10",
    border: "hover:border-red-500/40",
    text: "text-red-500",
  },
  "game-data": {
    avatar: "bg-amber-500/10",
    border: "hover:border-amber-500/40",
    text: "text-amber-500",
  },
  infrastructure: {
    avatar: "bg-blue-500/10",
    border: "hover:border-blue-500/40",
    text: "text-blue-500",
  },
  mechanics: {
    avatar: "bg-purple-500/10",
    border: "hover:border-purple-500/40",
    text: "text-purple-500",
  },
  overview: {
    avatar: "bg-emerald-500/10",
    border: "hover:border-emerald-500/40",
    text: "text-emerald-500",
  },
  portal: {
    avatar: "bg-cyan-500/10",
    border: "hover:border-cyan-500/40",
    text: "text-cyan-500",
  },
  simulation: {
    avatar: "bg-orange-500/10",
    border: "hover:border-orange-500/40",
    text: "text-orange-500",
  },
};

export function BibleIndexPage() {
  const content = useIntlayer("bibleIndex");
  const sections = bible.index.filter((item) => item.children);
  const rootEntries = bible.index.filter((item) => !item.children);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            {content.summary({
              articles: bible.slugs.length,
              count: sections.length,
              sections: sections.length,
            })}
          </p>
        </div>
        <Button asChild size="sm">
          <Link
            href={href(routes.dev.bible.page, {
              slug: bible.getFirstSlug(),
            })}
          >
            <ScrollIcon className="size-4" />
            {content.readIntroduction}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const colors = SECTION_COLORS[section.slug] ?? DEFAULT_SECTION_COLORS;
          const Icon = SECTION_ICONS[section.slug] ?? BookOpenIcon;
          const childCount = section.children?.length ?? 0;

          return (
            <Card
              key={section.slug}
              className={cn(
                "shadow-none transition-colors duration-200",
                colors.border,
              )}
            >
              <CardContent>
                <div className="flex items-start justify-between">
                  <Avatar className="mb-4 size-10 rounded-md">
                    <AvatarFallback
                      className={cn(
                        "rounded-md [&>svg]:size-5",
                        colors.avatar,
                        colors.text,
                      )}
                    >
                      <Icon />
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="text-xs">
                    {childCount}
                  </Badge>
                </div>
                <h3 className="mb-1.5 text-base font-semibold">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {section.children?.map((child) => (
                    <Link
                      key={child.slug}
                      href={href(routes.dev.bible.page, { slug: child.slug })}
                      className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {rootEntries.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            {content.reference}
          </h3>
          <div className="flex flex-wrap gap-2">
            {rootEntries.map((entry) => (
              <Button key={entry.slug} variant="outline" size="sm" asChild>
                <Link href={href(routes.dev.bible.page, { slug: entry.slug })}>
                  {entry.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
