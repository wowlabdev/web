"use client";

import { useIntlayer } from "next-intlayer";

import { ErrorPageError } from "@wowlab/shared/components/common/errors";

export default function ErrorBoundary({
  error,
  reset,
}: Readonly<{
  error: { digest?: string } & Error;
  reset: () => void;
}>) {
  const content = useIntlayer("sharedError");

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
