import dynamic from "next/dynamic";
import { type ComponentType, createElement } from "react";

import { Skeleton } from "../../../../common/skeleton-blocks";

const MermaidRenderer = dynamic(
  () => import("./mermaid-renderer").then((module) => module.MermaidRenderer),
  {
    loading: () => createElement(Skeleton, { className: "h-32 w-full" }),
    ssr: false,
  },
);

export type CodeRenderer = ComponentType<{ code: string }>;

export const RENDERERS: Record<string, CodeRenderer> = {
  mermaid: MermaidRenderer,
};
