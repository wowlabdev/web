"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useIntlayer } from "next-intlayer";
import { type ReactNode, Suspense } from "react";

import { useMounted } from "@/hooks";
import { captureError } from "@/lib/observability";
import { isWasmSupported } from "@/lib/wasm/status";
import { ErrorBoundary } from "@wowlab/shared/components/error-boundary";

type WasmBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

export function WasmBoundary({
  children,
  fallback,
}: Readonly<WasmBoundaryProps>) {
  const mounted = useMounted();
  const { reset } = useQueryErrorResetBoundary();

  if (!mounted) {
    return <>{fallback}</>;
  }

  if (!isWasmSupported()) {
    return <WasmUnsupported />;
  }

  // ErrorBoundary must sit outside Suspense to catch rejected WASM init; reset clears the failed query so retry re-initializes.
  return (
    <ErrorBoundary
      onError={(error) =>
        captureError(error, "wasm-boundary", "WASM boundary caught an error")
      }
      onReset={reset}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function WasmUnsupported() {
  const content = useIntlayer("commonComponents");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">{content.wasmUnsupported}</p>
    </div>
  );
}
