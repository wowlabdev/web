"use client";

import { ArchiveIcon, ExternalLinkIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { hasArchive, type Reference, references } from "@/content/references";
import { FormattedDate } from "@wowlab/shared/components/common";
import { MdImg } from "@wowlab/shared/components/content/md/md-img";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Link } from "@wowlab/shared/components/ui/link";

import { getRefUrl } from "./get-ref-url";

export function MdBibliography() {
  const { citation: content } = useIntlayer("article");
  const allRefs = Object.entries(references);

  if (allRefs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {allRefs.map(([id, ref], idx) => {
        const waybackUrl = getWaybackUrl(ref);

        return (
          <div
            key={id}
            id={`ref-${id}`}
            className="flex items-start gap-4 py-3"
          >
            <Badge variant="secondary" className="shrink-0">
              {idx + 1}
            </Badge>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-medium">{ref.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {ref.authors} ({ref.year}
                    ). <span className="italic">{ref.source}</span>
                    {hasArchive(ref) && (
                      <>
                        {" "}
                        {content.accessed}{" "}
                        <FormattedDate
                          value={ref.archive.accessedAt}
                          day="numeric"
                          month="long"
                          year="numeric"
                        />
                        .
                      </>
                    )}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {waybackUrl && (
                    <Link
                      href={waybackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={content.waybackArchive.value}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ArchiveIcon className="size-3.5" />
                    </Link>
                  )}
                  {getRefUrl(ref) && (
                    <Link
                      href={getRefUrl(ref)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={content.originalSource.value}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLinkIcon className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>
              {hasArchive(ref) && (
                <div className="max-w-sm">
                  <MdImg src={ref.archive.screenshot.src} alt={ref.title} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getWaybackUrl(ref: Reference): string | undefined {
  if (!hasArchive(ref)) {
    return undefined;
  }

  const timestamp = ref.archive.accessedAt.replaceAll("-", "");

  return `https://web.archive.org/web/${timestamp}/${ref.url}`;
}
