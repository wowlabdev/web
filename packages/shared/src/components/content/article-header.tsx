import type { ReactNode } from "react";

import { cn } from "@wowlab/shared/lib/utils";

export type ArticleHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  beforeTitle?: ReactNode;
  prose?: boolean;
  className?: string;
  children?: ReactNode;
};

export function ArticleHeader({
  beforeTitle,
  children,
  className,
  description,
  descriptionClassName,
  prose = false,
  title,
}: Readonly<ArticleHeaderProps>) {
  return (
    <header
      className={cn(
        !prose && "not-prose",
        "mb-10 space-y-4 border-b pb-8",
        className,
      )}
    >
      {beforeTitle}
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
      {description ? (
        <p
          className={cn("text-lg text-muted-foreground", descriptionClassName)}
        >
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}
