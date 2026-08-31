"use client";

import { DemoSection } from "../demo";
import { ChartsDemo } from "./visualization-charts";
import { TimelineDemo } from "./visualization-timeline";

export function VisualizationSection() {
  return (
    <DemoSection id="visualization" title="Charts">
      <ChartsDemo />
      <TimelineDemo />
    </DemoSection>
  );
}
