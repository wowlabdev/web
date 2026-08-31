"use client";

import type { ReactNode } from "react";

import { Button } from "@wowlab/shared/components/ui/button";

import { ErrorPage } from "./error-page";

type ErrorPageErrorProps = {
  actionLabel: ReactNode;
  digestLabel: ReactNode;
  error: { digest?: string } & Error;
  reset: () => void;
  subtitle: ReactNode;
};

export function ErrorPageError({
  actionLabel,
  digestLabel,
  error,
  reset,
  subtitle,
}: Readonly<ErrorPageErrorProps>) {
  return (
    <ErrorPage
      title="500"
      subtitle={subtitle}
      description={
        <>
          <pre className="bg-destructive/10 text-destructive mx-auto max-w-lg overflow-auto rounded-md px-4 py-3 text-left text-xs whitespace-pre-wrap">
            {error.message}
          </pre>
          {error.digest && (
            <p className="text-muted-foreground mt-2 text-xs">
              {digestLabel}:{error.digest}
            </p>
          )}
        </>
      }
      action={
        <Button
          size="lg"
          variant="outline"
          className="rounded-lg text-base"
          onClick={reset}
        >
          {actionLabel}
        </Button>
      }
    />
  );
}
