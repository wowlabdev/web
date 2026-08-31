"use client";

import { AlertCircle, Info } from "lucide-react";
import { useState } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";
import { MotionPreset } from "@wowlab/shared/components/ui/motion-preset";
import { Progress } from "@wowlab/shared/components/ui/progress";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@wowlab/shared/components/ui/resizable";
import { Separator } from "@wowlab/shared/components/ui/separator";

import { DemoBox, DemoSection, DemoSubsection } from "../demo";

export function FeedbackSection() {
  return (
    <DemoSection id="feedback" title="Feedback & Layout">
      <AlertDemo />
      <ProgressDemo />
      <SeparatorDemo />
      <ResizableDemo />
      <MotionPresetDemo />
    </DemoSection>
  );
}

function AlertDemo() {
  return (
    <DemoSubsection title="Alert">
      <DemoBox className="flex-col items-stretch">
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>
            This is a default alert with an icon and description.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Destructive Alert</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      </DemoBox>
    </DemoSubsection>
  );
}

function MotionPresetDemo() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <DemoSubsection title="Motion Preset">
      <DemoBox className="flex-col items-stretch">
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => setReplayKey((k) => k + 1)}
        >
          Replay
        </Button>
        <div key={replayKey} className="grid gap-3 sm:grid-cols-3">
          <MotionPreset fade slide>
            <div className="bg-muted/30 rounded-sm border border-dashed p-3 text-xs">
              Fade + slide up
            </div>
          </MotionPreset>
          <MotionPreset fade slide={{ direction: "left" }} delay={0.1}>
            <div className="bg-muted/30 rounded-sm border border-dashed p-3 text-xs">
              Slide from left
            </div>
          </MotionPreset>
          <MotionPreset fade zoom delay={0.2}>
            <div className="bg-muted/30 rounded-sm border border-dashed p-3 text-xs">
              Fade + zoom
            </div>
          </MotionPreset>
        </div>
      </DemoBox>
    </DemoSubsection>
  );
}

function ProgressDemo() {
  return (
    <DemoSubsection title="Progress">
      <DemoBox className="flex-col items-stretch">
        <Progress value={0} />
        <Progress value={33} />
        <Progress value={66} />
        <Progress value={100} />
      </DemoBox>
    </DemoSubsection>
  );
}

function ResizableDemo() {
  return (
    <DemoSubsection title="Resizable">
      <DemoBox className="flex-col items-stretch p-0">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-32 rounded-sm border"
        >
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full items-center justify-center p-4 text-xs">
              Left
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center p-4 text-xs">
              Right
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DemoBox>
    </DemoSubsection>
  );
}

function SeparatorDemo() {
  return (
    <DemoSubsection title="Separator">
      <DemoBox className="flex-col items-stretch">
        <div className="space-y-1">
          <p className="text-xs font-medium">Section A</p>
          <p className="text-muted-foreground text-xs">
            Some content above the separator.
          </p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-xs font-medium">Section B</p>
          <p className="text-muted-foreground text-xs">
            Some content below the separator.
          </p>
        </div>
      </DemoBox>
      <DemoBox>
        <span className="text-xs">Left</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-xs">Right</span>
      </DemoBox>
    </DemoSubsection>
  );
}
