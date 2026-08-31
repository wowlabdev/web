"use client";

import { useSyncExternalStore } from "react";

const noop = () => {};
const subscribe = () => noop;
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
