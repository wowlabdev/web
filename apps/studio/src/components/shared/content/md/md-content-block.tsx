"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@wowlab/shared/components/ui/hover-card";
import { Link } from "@wowlab/shared/components/ui/link";
import { cn } from "@wowlab/shared/lib/utils";

type ContentBlockConfig = {
  icon: LucideIcon;
  listPath: string;
  prefix: string;
};

type ContentEntry = {
  caption: string;
  description: string;
  id: string;
  page: string;
};

type MdContentBlockProps = {
  caption?: string;
  children?: ReactNode;
  config: ContentBlockConfig;
  entry: ContentEntry | undefined;
  id: string;
  label: string;
  labelLower: string;
  num: number;
};

type MdContentListProps = {
  config: ContentBlockConfig;
  getNumber: (id: string) => number;
  groups: Record<string, ContentEntry[]>;
};

export function MdContentBlock({
  caption,
  children,
  config,
  entry,
  id,
  label,
  labelLower,
  num,
}: Readonly<MdContentBlockProps>) {
  const { contentBlock } = useIntlayer("article");
  const Icon = config.icon;

  if (!entry) {
    return (
      <figure className="my-6">
        {children}
        <figcaption className="mt-2 text-xs text-destructive">
          {contentBlock.unknownCaption({ id, label, labelLower })}
        </figcaption>
      </figure>
    );
  }

  const displayCaption = caption ?? entry.caption;

  return (
    <Card id={`${config.prefix}-${id}`} className="my-6">
      <CardHeader className="flex flex-row items-center gap-2 border-b bg-muted/30">
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Link
              href={`/dev/bible/${config.listPath}#${config.prefix}-${id}`}
              className="shrink-0 text-xs font-medium"
            >
              <span className="inline-flex items-center gap-1">
                <Icon className="size-3" />
                {label} {num}
              </span>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {entry.description}
              </span>
              <span className="text-xs text-muted-foreground/60">
                {entry.page}
              </span>
            </div>
          </HoverCardContent>
        </HoverCard>
        <CardTitle>{displayCaption}</CardTitle>
      </CardHeader>
      <CardContent className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </CardContent>
      <CardFooter className="text-muted-foreground">
        {entry.description}
      </CardFooter>
    </Card>
  );
}

export function MdContentList({
  config,
  getNumber,
  groups,
}: Readonly<MdContentListProps>) {
  const sections = Object.keys(groups);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      {sections.map((section) => (
        <div key={section}>
          <span className="mb-1 ml-1 text-xs font-bold text-muted-foreground">
            {section}
          </span>
          <div className="ml-1 flex flex-col border-l-2 border-border">
            {groups[section].map((entry, idx) => {
              const num = getNumber(entry.id);

              return (
                <div
                  key={entry.id}
                  id={`${config.prefix}-${entry.id}`}
                  className={cn(
                    "flex items-start gap-3 px-3 py-2 hover:bg-muted/50",
                    idx % 2 !== 0 && "bg-muted/30",
                  )}
                >
                  <Badge variant="secondary" className="shrink-0">
                    {num}
                  </Badge>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium">{entry.caption}</span>
                    <span className="text-xs text-muted-foreground">
                      {entry.description}
                    </span>
                    <Link
                      href={`/dev/bible/${entry.page}#${config.prefix}-${entry.id}`}
                      className="text-xs text-primary"
                    >
                      {entry.page}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
