"use client";

import { useInViewport } from "ahooks";
import { useState } from "react";

export function useActiveHeading(ids: string[]): string {
  const [activeId, setActiveId] = useState("");

  useInViewport(
    ids.map(
      (id) => () => document.querySelector<HTMLElement>(`#${CSS.escape(id)}`),
    ),
    {
      callback: (entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      },
      rootMargin: "-80px 0px -80% 0px",
    },
  );

  return activeId;
}
