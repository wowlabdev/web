"use client";

import type { CardComponentProps } from "nextstepjs";

import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Progress } from "@wowlab/shared/components/ui/progress";

export function TourCard({
  arrow,
  currentStep,
  nextStep,
  prevStep,
  skipTour,
  step,
  totalSteps,
}: Readonly<CardComponentProps>) {
  const content = useIntlayer("onboardingTour");
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className="w-80 max-w-[90vw] gap-3 py-3 shadow-lg">
      <CardHeader>
        <CardTitle className="text-base leading-tight">{step.title}</CardTitle>
        <CardAction>
          <span className="text-muted-foreground text-xs tabular-nums">
            {currentStep + 1}/{totalSteps}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm/relaxed">
        {step.content}
      </CardContent>
      <Progress value={progress} className="h-1 rounded-none" />
      <CardFooter className="justify-between gap-2 pt-3">
        {step.showSkip && skipTour ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="text-muted-foreground"
          >
            {content.skip}
          </Button>
        ) : (
          <span />
        )}
        {step.showControls ? (
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                {content.back}
              </Button>
            )}
            <Button size="sm" onClick={nextStep}>
              {isLast ? content.finish : content.next}
            </Button>
          </div>
        ) : null}
      </CardFooter>
      {arrow}
    </Card>
  );
}
