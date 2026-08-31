"use client";

import type { ReactNode } from "react";

import { useState } from "react";

import type { QueryResult } from "@/lib/data/result";

import { Input } from "@wowlab/shared/components/ui/input";

import { ResultFrame, ResultPanel } from "./result-panel";
import { resultState } from "./result-state";

export function ByIdDemo<T>({
  defaultId,
  render,
  useResult,
}: Readonly<{
  defaultId: number;
  render: (id: number, data: T | undefined) => ReactNode;
  useResult: (id: number) => QueryResult<T>;
}>) {
  const [id, setId] = useState(defaultId);
  const result = useResult(id);

  return (
    <div className="space-y-3">
      <Input
        type="number"
        className="w-32"
        value={id}
        onChange={(event) => setId(Number(event.target.value))}
      />
      <ResultFrame>
        <ResultPanel state={resultState(result)}>
          {render(id, result.data)}
        </ResultPanel>
      </ResultFrame>
    </div>
  );
}
