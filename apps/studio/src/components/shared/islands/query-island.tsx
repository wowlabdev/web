"use client";

import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query/query-client";

type QueryIslandProps = {
  children: ReactNode;
};

export function QueryIsland({ children }: Readonly<QueryIslandProps>) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
