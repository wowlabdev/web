"use client";

import type { ReactNode } from "react";

import { NextStep, NextStepProvider } from "nextstepjs";

import {
  TourAutostart,
  TourCard,
  useTourSteps,
} from "@/components/shared/tour";
import { useBrowserSettings } from "@/lib/state";

type TourIslandProps = {
  children: ReactNode;
};

export function TourIsland({ children }: Readonly<TourIslandProps>) {
  const steps = useTourSteps();
  const markWelcomeSeen = useBrowserSettings((s) => s.markWelcomeTourSeen);

  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={TourCard}
        shadowRgb="9, 9, 11"
        shadowOpacity="0.6"
        onComplete={markWelcomeSeen}
        onSkip={markWelcomeSeen}
      >
        <TourAutostart />
        {children}
      </NextStep>
    </NextStepProvider>
  );
}
