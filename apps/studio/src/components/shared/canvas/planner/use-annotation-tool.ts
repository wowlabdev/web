"use client";

import { useState } from "react";

import type { AnnotationTool } from "./annotation-builder";

import { ANNOTATION_PALETTE } from "./annotation-palette";

export function useAnnotationTool(): {
  tool: AnnotationTool;
  setTool: (tool: AnnotationTool) => void;
  color: string;
  setColor: (color: string) => void;
} {
  const [tool, setTool] = useState<AnnotationTool>("select");
  const [color, setColor] = useState<string>(ANNOTATION_PALETTE[0]);

  return { color, setColor, setTool, tool };
}
