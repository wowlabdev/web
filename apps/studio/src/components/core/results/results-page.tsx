"use client";

import { WasmBoundary } from "@/components/shared/wasm";

import { ResultsContent } from "./results-content";
import { ResultsPageSkeleton } from "./results-page-skeleton";

type ResultsPageProps = {
  jobId: string;
};

export function ResultsPage({ jobId }: Readonly<ResultsPageProps>) {
  return (
    <WasmBoundary fallback={<ResultsPageSkeleton />}>
      <ResultsContent jobId={jobId} />
    </WasmBoundary>
  );
}
