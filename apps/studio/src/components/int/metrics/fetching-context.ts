"use client";

import { createContext } from "react";

export type FetchingContextValue = {
  isAnyFetching: boolean;
  report: (id: string, fetching: boolean) => void;
};

export const FetchingContext = createContext<FetchingContextValue>({
  isAnyFetching: false,
  report: () => {},
});
