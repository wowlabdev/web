"use client";

import type { ReactNode } from "react";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

type NuqsIslandProps = {
  children: ReactNode;
  fallback: ReactNode;
};

export function NuqsIsland({ children, fallback }: Readonly<NuqsIslandProps>) {
  return (
    <Suspense fallback={fallback}>
      <NuqsAdapter>{children}</NuqsAdapter>
    </Suspense>
  );
}
