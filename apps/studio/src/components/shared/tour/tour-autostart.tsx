"use client";

import { useMount } from "ahooks";
import { useLocale } from "next-intlayer";
import { useNextStep } from "nextstepjs";

import { useBrowserSettings } from "@/lib/state";

import { WELCOME_TOUR } from "./use-tour-steps";

export function TourAutostart() {
  const { startNextStep } = useNextStep();
  const { pathWithoutLocale } = useLocale();

  useMount(() => {
    if (
      pathWithoutLocale === "/" &&
      !useBrowserSettings.getState().hasSeenWelcomeTour
    ) {
      startNextStep(WELCOME_TOUR);
    }
  });

  return null;
}
