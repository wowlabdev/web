"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import { LandingMediaExpand } from "@/components/landing/landing-media-expand";
import {
  AddonPreviewCarousel,
  AddonPreviewScope,
} from "@wowlab/shared/components/addon/addon-preview-carousel";
import { cn } from "@wowlab/shared/lib/utils";

export function LandingAddonPreview({
  className,
}: Readonly<{ className?: string }>) {
  const content = useIntlayer("addonPage");

  return (
    <AddonPreviewScope>
      <AddonPreviewCarousel
        className={cn("max-w-xl", className)}
        renderOverlay={(expanded: ReactNode) => (
          <LandingMediaExpand expanded={expanded} title={content.badge.value} />
        )}
      />
    </AddonPreviewScope>
  );
}
