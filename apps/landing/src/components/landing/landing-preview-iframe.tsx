"use client";

import { useSize } from "ahooks";
import { useRef } from "react";

import {
  LANDING_MEDIA_FRAME_CLASS,
  LandingMediaExpand,
} from "@/components/landing/landing-media-expand";
import { cn } from "@wowlab/shared/lib/utils";

const NATURAL_WIDTH = 1440;

type LandingPreviewIframeProps = {
  className?: string;
  contentHeight?: number;
  src: string;
  title: string;
};

export function LandingPreviewIframe({
  className,
  contentHeight = 900,
  src,
  title,
}: Readonly<LandingPreviewIframeProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);
  const containerWidth = size?.width ?? NATURAL_WIDTH;
  const scale = containerWidth / NATURAL_WIDTH;

  return (
    <div
      ref={containerRef}
      className={cn(LANDING_MEDIA_FRAME_CLASS, className)}
      style={{ height: contentHeight * scale }}
    >
      <div className="contents" inert>
        <iframe
          src={src}
          title={title}
          // eslint-disable-next-line @eslint-react/dom-no-unsafe-iframe-sandbox -- first-party cross-origin app preview; SOP contains it while scripts remain required
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{
            height: `${contentHeight}px`,
            transform: `scale(${scale})`,
            width: `${NATURAL_WIDTH}px`,
          }}
        />
      </div>
      <LandingMediaExpand
        title={title}
        dialogClassName="h-[85vh]"
        expanded={
          <div className="contents" inert>
            <iframe
              src={src}
              title={title}
              // eslint-disable-next-line @eslint-react/dom-no-unsafe-iframe-sandbox -- first-party cross-origin app preview; SOP contains it while scripts remain required
              sandbox="allow-scripts allow-same-origin"
              className="pointer-events-none size-full border-0 bg-background"
            />
          </div>
        }
      />
    </div>
  );
}
