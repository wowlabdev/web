"use client";

import { useMemoizedFn } from "ahooks";
import { useMemo, useState } from "react";

import { FetchingContext } from "./fetching-context";

type MetricsFetchingScopeProps = {
  children: React.ReactNode;
};

export function MetricsFetchingScope({
  children,
}: Readonly<MetricsFetchingScopeProps>) {
  const [states, setStates] = useState<Record<string, boolean>>({});

  const report = useMemoizedFn((id: string, fetching: boolean) => {
    setStates((prev) => {
      if (prev[id] === fetching) {
        return prev;
      }

      return { ...prev, [id]: fetching };
    });
  });

  const isAnyFetching = useMemo(
    () => Object.values(states).some(Boolean),
    [states],
  );

  const value = useMemo(
    () => ({ isAnyFetching, report }),
    [report, isAnyFetching],
  );

  return <FetchingContext value={value}>{children}</FetchingContext>;
}
