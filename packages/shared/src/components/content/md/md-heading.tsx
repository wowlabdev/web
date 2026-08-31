"use client";

import type { ReactNode } from "react";

import { LinkIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

type MdHeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  children: ReactNode;
};

const HEADING_TAGS = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

export function MdH1({
  children,
  id,
}: Readonly<Omit<MdHeadingProps, "level">>) {
  return (
    <MdHeading level={1} id={id}>
      {children}
    </MdHeading>
  );
}

export function MdH2({
  children,
  id,
}: Readonly<Omit<MdHeadingProps, "level">>) {
  return (
    <MdHeading level={2} id={id}>
      {children}
    </MdHeading>
  );
}

export function MdH3({
  children,
  id,
}: Readonly<Omit<MdHeadingProps, "level">>) {
  return (
    <MdHeading level={3} id={id}>
      {children}
    </MdHeading>
  );
}

export function MdH4({
  children,
  id,
}: Readonly<Omit<MdHeadingProps, "level">>) {
  return (
    <MdHeading level={4} id={id}>
      {children}
    </MdHeading>
  );
}

export function MdH5({
  children,
  id,
}: Readonly<Omit<MdHeadingProps, "level">>) {
  return (
    <MdHeading level={5} id={id}>
      {children}
    </MdHeading>
  );
}

export function MdH6({
  children,
  id,
}: Readonly<Omit<MdHeadingProps, "level">>) {
  return (
    <MdHeading level={6} id={id}>
      {children}
    </MdHeading>
  );
}

const ICON_SIZE: Record<number, string> = {
  1: "size-5",
  2: "size-4",
  3: "size-4",
  4: "size-3.5",
  5: "size-3.5",
  6: "size-3",
};

function MdHeading({ children, id, level }: Readonly<MdHeadingProps>) {
  const { heading: content } = useIntlayer("article");
  const HeadingTag = HEADING_TAGS[level];

  return (
    <HeadingTag
      id={id}
      className="group/heading relative flex scroll-mt-20 items-center gap-2"
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/heading:opacity-100"
          aria-label={content.linkToSection.value}
        >
          <LinkIcon className={ICON_SIZE[level]} />
        </a>
      )}
    </HeadingTag>
  );
}
