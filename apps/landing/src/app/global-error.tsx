"use client";

import {
  ErrorPageError,
  ErrorPageShell,
} from "@wowlab/shared/components/common/errors";

import "./globals.css";

// Root boundary fires before IntlayerProvider mounts, so strings stay English.
export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: { digest?: string } & Error;
  reset: () => void;
}>) {
  return (
    <ErrorPageShell title="500 · Something broke">
      <ErrorPageError
        error={error}
        reset={reset}
        subtitle="Something broke."
        digestLabel="Digest"
        actionLabel="Try again"
      />
    </ErrorPageShell>
  );
}
