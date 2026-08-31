"use client";

import type { ReactNode } from "react";
import type { ZoomRef } from "yet-another-react-lightbox";

import { useBoolean } from "ahooks";
import { useRef } from "react";
import YarlLightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { cn } from "@wowlab/shared/lib/utils";

type LightboxTriggerProps = {
  children: ReactNode;
  initialZoom?: number;
  src?: string;
  title?: string;
  variant?: "diagram" | "image";
};

export function LightboxTrigger({
  children,
  initialZoom,
  src,
  title,
  variant = "image",
}: Readonly<LightboxTriggerProps>) {
  const [open, { setFalse: closeLightbox, setTrue: openLightbox }] =
    useBoolean(false);
  const zoomRef = useRef<ZoomRef>(null);
  const isInline = variant === "image";
  const Tag = isInline ? "span" : "div";

  return (
    <>
      <Tag
        className={cn("cursor-zoom-in", isInline ? "inline" : "block")}
        onClick={openLightbox}
        title={title}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox();
          }
        }}
      >
        {children}
      </Tag>

      {src && (
        <YarlLightbox
          open={open}
          close={closeLightbox}
          slides={[{ alt: title, src }]}
          plugins={[Zoom, Fullscreen]}
          controller={{ closeOnBackdropClick: true }}
          carousel={{ finite: true }}
          zoom={{
            maxZoomPixelRatio: 3,
            ref: zoomRef,
            scrollToZoom: true,
          }}
          on={{
            entered: () => {
              if (initialZoom && initialZoom > 1) {
                zoomRef.current?.changeZoom(initialZoom);
              }
            },
          }}
          render={{
            buttonNext: () => null,
            buttonPrev: () => null,
          }}
        />
      )}
    </>
  );
}
