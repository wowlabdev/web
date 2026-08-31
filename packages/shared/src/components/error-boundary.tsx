"use client";

import type { ComponentProps, ReactNode } from "react";

import { useIntlayer } from "next-intlayer";
import {
  type FallbackProps,
  getErrorMessage,
  ErrorBoundary as ReactErrorBoundary,
} from "react-error-boundary";

import { Button } from "@wowlab/shared/components/ui/button";

type ErrorBoundaryProps = {
  children: ReactNode;
  onError?: NonNullable<ComponentProps<typeof ReactErrorBoundary>["onError"]>;
  onReset?: () => void;
  resetKeys?: unknown[];
};

export function ErrorBoundary({
  children,
  onError,
  onReset,
  resetKeys,
}: Readonly<ErrorBoundaryProps>) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={onError}
      onReset={onReset}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: Readonly<FallbackProps>) {
  const content = useIntlayer("sharedError");
  const message = getErrorMessage(error);
  const stack = error instanceof Error ? error.stack : undefined;

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 px-4 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-medium">{content.title}</h2>
        <pre className="max-w-lg overflow-auto whitespace-pre-wrap rounded-md bg-destructive/10 px-4 py-3 text-left text-xs text-destructive">
          {message ?? content.unknownError}
        </pre>
        {stack && (
          <details className="max-w-lg text-left">
            <summary className="cursor-pointer text-xs text-muted-foreground">
              {content.stackTrace}
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted px-3 py-2 text-[10px] text-muted-foreground">
              {stack}
            </pre>
          </details>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        {content.tryAgain}
      </Button>
    </div>
  );
}
