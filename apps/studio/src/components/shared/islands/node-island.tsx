"use client";

import { type ReactNode } from "react";

import { useNodeConnection } from "@/components/shared/node/use-node-connection";

export function NodeIsland({ children }: Readonly<{ children: ReactNode }>) {
  useNodeConnection();

  return children;
}
