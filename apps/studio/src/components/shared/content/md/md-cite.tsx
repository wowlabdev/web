"use client";

import { ExternalLinkIcon, MapPinIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  hasArchive,
  hasDoi,
  type Reference,
  references,
} from "@/content/references";
import { MdImg } from "@wowlab/shared/components/content/md/md-img";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@wowlab/shared/components/ui/hover-card";
import { Link } from "@wowlab/shared/components/ui/link";

import { getRefUrl } from "./get-ref-url";

const LOCATORS = [
  { key: "s", prefix: "§" },
  { key: "p", prefix: "p. " },
  { key: "line", prefix: "line " },
  { key: "loc", prefix: "" },
] as const;

type LocatorKey = (typeof LOCATORS)[number]["key"];
type LocatorProps = Partial<Record<LocatorKey, string | number>>;

type MdCiteProps = {
  id: string;
  children?: React.ReactNode;
} & LocatorProps;

type RefLinkProps = {
  reference: Reference;
};

export function MdCite({ children, id, ...locatorProps }: MdCiteProps) {
  const ref = Object.hasOwn(references, id) ? references[id] : undefined;
  const num = Object.keys(references).indexOf(id) + 1;
  const location = formatLocation(locatorProps);

  if (!ref) {
    return <span className="text-xs text-destructive">{children} (?)</span>;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link
          href={`/dev/bible/references#ref-${id}`}
          className="whitespace-nowrap"
        >
          {children} ({num})
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col gap-2">
          {hasArchive(ref) && (
            <MdImg src={ref.archive.screenshot.src} alt={ref.title} />
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{ref.title}</span>
            <span className="text-xs text-muted-foreground">
              {ref.authors} ({ref.year})
            </span>
            {location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPinIcon className="size-3" />
                <span className="font-mono">{location}</span>
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs italic text-muted-foreground">
                {ref.source}
              </span>
              <RefLink reference={ref} />
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function formatLocation(props: LocatorProps): string | undefined {
  const parts = LOCATORS.map(({ key, prefix }) => {
    const value = props[key];

    if (value === undefined) {
      return null;
    }

    return `${prefix}${value}`;
  }).filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : undefined;
}

function RefLink({ reference }: Readonly<RefLinkProps>) {
  const { citation: content } = useIntlayer("article");
  const url = getRefUrl(reference);

  if (!url) {
    return null;
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
    >
      {hasDoi(reference) ? content.doi : content.link}
      <ExternalLinkIcon className="size-3" />
    </Link>
  );
}
