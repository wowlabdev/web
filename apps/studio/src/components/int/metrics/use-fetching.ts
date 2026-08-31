"use client";

import { use } from "react";

import { FetchingContext } from "./fetching-context";

export function useFetching() {
  return use(FetchingContext);
}
