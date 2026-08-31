"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

import type { ResultState } from "./result-state";

export function ResultFrame({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="bg-muted/30 flex min-h-12 items-center rounded-md border px-3 py-2">
      {children}
    </div>
  );
}

export function ResultPanel({
  children,
  state,
}: Readonly<{ children?: ReactNode; state: ResultState }>) {
  const content = useIntlayer("hooksPage");

  if (state === "loading") {
    return <Skeleton className="h-6 w-40" />;
  }

  if (state === "error") {
    return (
      <span className="text-destructive text-sm">{content.errorLabel}</span>
    );
  }

  if (state === "notFound") {
    return (
      <span className="text-muted-foreground text-sm">{content.notFound}</span>
    );
  }

  if (state === "empty") {
    return (
      <span className="text-muted-foreground text-sm">{content.empty}</span>
    );
  }

  return <>{children}</>;
}
