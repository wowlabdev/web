"use client";

import { CalendarIcon, Clock } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { FormattedDate } from "@wowlab/shared/components/common/formatted-date";

export type ArticleMetaInfo = {
  date?: string;
  readingTime?: number;
};

type ArticleSidebarMetaProps = {
  meta: ArticleMetaInfo;
};

export function ArticleSidebarMeta({
  meta,
}: Readonly<ArticleSidebarMetaProps>) {
  const { sidebarMeta: content } = useIntlayer("article");

  return (
    <div className="flex flex-col items-start gap-1.5">
      {meta.date && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="size-3" />
          <time className="text-xs">
            <FormattedDate
              value={meta.date}
              day="numeric"
              month="short"
              year="numeric"
            />
          </time>
        </div>
      )}
      {meta.readingTime && meta.readingTime > 0 ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-3" />
          <span className="text-xs">
            {content.minRead({ count: meta.readingTime })}
          </span>
        </div>
      ) : null}
    </div>
  );
}
