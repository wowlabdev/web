"use client";

import { useIntlayer } from "next-intlayer";

import type { HintState } from "./use-annotation-drawing";
type HintBannerProps = {
  hint: HintState;
};

export function HintBanner({ hint }: Readonly<HintBannerProps>) {
  const content = useIntlayer("canvasPlanner");
  let label: React.ReactNode;

  switch (hint.kind) {
    case "pathFinish": {
      label = content.hintPathFinishCount(hint.count);
      break;
    }

    case "pathRemaining": {
      label = content.hintPathRemaining(hint.count);
      break;
    }

    case "pathStart": {
      label = content.hintPathStart;
      break;
    }

    case "polygonFinish": {
      label = content.hintPolygonFinishCount(hint.count);
      break;
    }

    case "polygonRemaining": {
      label = content.hintPolygonRemaining(hint.count);
      break;
    }

    case "polygonStart": {
      label = content.hintPolygonStart;
      break;
    }
  }

  return (
    <div className="bg-background/90 ring-border text-muted-foreground pointer-events-none absolute left-3 top-3 border px-2 py-1 text-xs backdrop-blur ring-1">
      {label}
    </div>
  );
}
