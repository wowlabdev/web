"use client";

import dynamic from "next/dynamic";

import type { KonvaCanvasProps } from "./konva-canvas";

const KonvaCanvas = dynamic(
  () => import("./konva-canvas").then((mod) => mod.KonvaCanvas),
  { ssr: false },
);

type CanvasViewProps = KonvaCanvasProps;

export function CanvasView(props: Readonly<CanvasViewProps>) {
  return <KonvaCanvas {...props} />;
}
