"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { type Term, terms } from "@/content/terms";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@wowlab/shared/components/ui/hover-card";
import { Link } from "@wowlab/shared/components/ui/link";
import { cn } from "@wowlab/shared/lib/utils";

type MdTermProps = {
  id: string;
  children?: React.ReactNode;
};

export function MdGlossary() {
  const allTerms = Object.values(terms).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  if (allTerms.length === 0) {
    return null;
  }

  const grouped = groupByLetter(allTerms);
  const letters = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex flex-col gap-5">
      {letters.map((letter) => (
        <div key={letter} id={`letter-${letter}`}>
          <span className="mb-1 ml-1 text-xs font-bold text-muted-foreground">
            {letter}
          </span>
          <div className="ml-1 flex flex-col gap-0 border-l-2 border-border">
            {grouped[letter].map((term, idx) => (
              <div
                key={term.id}
                id={`term-${term.id}`}
                className={cn(
                  "flex items-baseline gap-2 px-3 py-1.5 hover:bg-muted/50",
                  idx % 2 !== 0 && "bg-muted/30",
                )}
              >
                <span
                  className="min-w-28 shrink-0 text-sm font-semibold"
                  title={term.long}
                >
                  {term.name}
                </span>
                <span className="flex-1 text-sm">{term.description}</span>
                {term.link && (
                  <Link href={term.link} className="shrink-0">
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MdTerm({ children, id }: Readonly<MdTermProps>) {
  const { term: content } = useIntlayer("article");
  const term = Object.hasOwn(terms, id) ? terms[id] : undefined;

  if (!term) {
    return (
      <span className="text-xs text-destructive">{children ?? id} (?)</span>
    );
  }

  const displayText = children ?? term.name;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link
          href={`/dev/bible/glossary#term-${id}`}
          className="border-b border-dashed border-muted-foreground font-medium"
        >
          {displayText}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{term.name}</span>
              {term.long && (
                <span className="text-xs text-muted-foreground">
                  {term.long}
                </span>
              )}
            </div>
            {term.link && (
              <Link
                href={term.link}
                className="inline-flex shrink-0 items-center gap-1 text-xs text-primary hover:underline"
              >
                {content.docs}
                <ExternalLinkIcon className="size-3" />
              </Link>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {term.description}
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function groupByLetter(list: Term[]): Record<string, Term[]> {
  return list.reduce<Record<string, Term[]>>((acc, t) => {
    const letter = t.name[0].toUpperCase();

    acc[letter] ??= [];
    acc[letter].push(t);

    return acc;
  }, {});
}
