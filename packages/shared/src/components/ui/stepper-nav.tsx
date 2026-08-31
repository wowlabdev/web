"use client";

import type { Step } from "@stepperize/react";

import { Tabs, TabsList, TabsTrigger } from "@wowlab/shared/components/ui/tabs";

export interface StepperNavProps<Steps extends readonly Step[]> {
  className?: string;
  currentId: string;
  isUnlocked?: (id: Steps[number]["id"]) => boolean;
  labels: Record<string, string>;
  onSelect: (id: Steps[number]["id"]) => void;
  steps: Steps;
}

export function StepperNav<Steps extends readonly Step[]>({
  className,
  currentId,
  isUnlocked,
  labels,
  onSelect,
  steps,
}: Readonly<StepperNavProps<Steps>>) {
  return (
    <Tabs
      value={currentId}
      onValueChange={(value) => {
        if (!isUnlocked || isUnlocked(value as Steps[number]["id"])) {
          onSelect(value as Steps[number]["id"]);
        }
      }}
      className={className}
    >
      <TabsList variant="line">
        {steps.map((step, i) => {
          const unlocked = isUnlocked
            ? isUnlocked(step.id as Steps[number]["id"])
            : true;

          return (
            <TabsTrigger key={step.id} value={step.id} disabled={!unlocked}>
              <span className="mr-1.5 opacity-50">{i + 1}.</span>
              {labels[step.id]}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
