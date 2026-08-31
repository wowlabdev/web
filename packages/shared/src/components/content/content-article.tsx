import type { ReactNode } from "react";

import { cn } from "@wowlab/shared/lib/utils";

type ContentArticleProps = {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
};

export function ContentArticle({
  children,
  className,
  footer,
}: Readonly<ContentArticleProps>) {
  return (
    <article className={cn("prose dark:prose-invert max-w-none", className)}>
      {children}
      {footer}
    </article>
  );
}
