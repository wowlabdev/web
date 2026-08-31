"use client";

import { Calendar, Clock, User } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

type ArticleMetaProps = {
  author?: string;
  date?: string;
  readingTime?: number;
};

export function ArticleMeta({
  author,
  date,
  readingTime,
}: Readonly<ArticleMetaProps>) {
  const { articleMeta: content } = useIntlayer("article");
  const formatDate = useDate();

  const formatted = date
    ? formatDate(new Date(date), {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const computedReadingTime = readingTime
    ? Math.max(1, Math.round(readingTime))
    : undefined;

  if (!formatted && !author && !computedReadingTime) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {formatted && (
        <MetaItem icon={Calendar}>
          <time className="text-xs">{formatted}</time>
        </MetaItem>
      )}
      {author && (
        <MetaItem icon={User}>
          <Link
            href={href(routes.users.profile, { handle: author })}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {author}
          </Link>
        </MetaItem>
      )}
      {computedReadingTime !== undefined && (
        <MetaItem icon={Clock}>
          <span className="text-xs">
            {content.minRead({ count: computedReadingTime })}
          </span>
        </MetaItem>
      )}
    </div>
  );
}

function MetaItem({
  children,
  icon: IconComponent,
}: Readonly<{
  icon: typeof Calendar;
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <IconComponent className="size-3" />
      {children}
    </div>
  );
}
