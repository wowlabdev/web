"use client";

import { useIntlayer } from "next-intlayer";
import { useEffect } from "react";

import { captureError } from "@/lib/observability";
import { ErrorPageError } from "@wowlab/shared/components/common/errors";

export default function ErrorBoundary({
  error,
  reset,
}: Readonly<{
  error: { digest?: string } & Error;
  reset: () => void;
}>) {
  const content = useIntlayer("sharedError");

  useEffect(() => {
    captureError(error, "route-error", "Unhandled route error");
  }, [error]);

  return (
    <ErrorPageError
      error={error}
      reset={reset}
      subtitle={content.title}
      digestLabel={content.digest}
      actionLabel={content.tryAgain}
    />
  );
}
