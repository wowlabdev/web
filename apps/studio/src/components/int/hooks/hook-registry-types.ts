import type { ComponentType } from "react";

export type HookEntry = {
  Demo: ComponentType;
  id: string;
  importPath: string;
  kind: HookKind;
  name: string;
  returnType: string;
  returns: HookReturns;
  signature: string;
  source: HookSource;
};

export type HookKind = "derived" | "global" | "list" | "search" | "single";

export type HookReturns = "QueryListResult" | "QueryResult";

export type HookSource = "game-data" | "react-query";
