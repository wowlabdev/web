"use client";

import type { PointerEvent as ReactPointerEvent } from "react";

import { useRef, useState } from "react";

const WIDTH_KEY = "wowlab.assistant.width";
const MIN_WIDTH = 360;
const DEFAULT_WIDTH = 440;
const MAX_WIDTH = 900;

export function useAssistantWidth() {
  const [width, setWidth] = useState(readStoredWidth);
  const resizingRef = useRef(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    resizingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (resizingRef.current) {
      setWidth(clampWidth(globalThis.innerWidth - e.clientX));
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!resizingRef.current) {
      return;
    }

    resizingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    try {
      globalThis.localStorage.setItem(WIDTH_KEY, String(width));
    } catch {
      /* empty */
    }
  };

  return {
    resizeHandleProps: { onPointerDown, onPointerMove, onPointerUp },
    width,
  };
}

function clampWidth(px: number): number {
  const max = Math.min(MAX_WIDTH, Math.round(globalThis.innerWidth * 0.92));

  return Math.max(MIN_WIDTH, Math.min(px, max));
}

function readStoredWidth(): number {
  try {
    const raw = Number(globalThis.localStorage.getItem(WIDTH_KEY));

    return Number.isFinite(raw) && raw > 0 ? clampWidth(raw) : DEFAULT_WIDTH;
  } catch {
    return DEFAULT_WIDTH;
  }
}
