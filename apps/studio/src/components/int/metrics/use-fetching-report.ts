"use client";

import { use, useEffect } from "react";

import { FetchingContext } from "./fetching-context";

export function useFetchingReport(id: string, fetching: boolean) {
  const { report } = use(FetchingContext);

  useEffect(() => {
    report(id, fetching);

    return () => report(id, false);
  }, [id, fetching, report]);
}
