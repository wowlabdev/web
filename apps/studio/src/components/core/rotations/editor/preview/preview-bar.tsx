"use client";

import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { type ReactNode } from "react";

import type { PreviewFightStyle } from "./constants";
import type { PreviewControls } from "./use-live-trace";

import { PreviewChipArchetype } from "./preview-chip-archetype";
import { PreviewChipDuration } from "./preview-chip-duration";
import { PreviewChipSeed } from "./preview-chip-seed";
import { PreviewChipTargets } from "./preview-chip-targets";

type PreviewBarProps = {
  onChange: (next: PreviewControls) => void;
  rightSlot?: ReactNode;
  value: PreviewControls;
};

export function PreviewBar({
  onChange,
  rightSlot,
  value,
}: Readonly<PreviewBarProps>) {
  const content = useIntlayer("rotationEditor");
  const setDuration = useMemoizedFn((durationS: number) =>
    onChange({ ...value, durationS }),
  );
  const setTargets = useMemoizedFn((targetCount: number) =>
    onChange({ ...value, targetCount }),
  );
  const setArchetype = useMemoizedFn((archetype: PreviewFightStyle) =>
    onChange({ ...value, archetype }),
  );
  const setSeed = useMemoizedFn((seed: number) => onChange({ ...value, seed }));

  return (
    <div
      aria-label={content.previewBarSettingsLabel.value}
      className="flex flex-wrap items-center gap-2 text-xs"
    >
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        <PreviewChipDuration value={value.durationS} onChange={setDuration} />
        <PreviewChipTargets value={value.targetCount} onChange={setTargets} />
        <PreviewChipArchetype value={value.archetype} onChange={setArchetype} />
        <PreviewChipSeed value={value.seed} onChange={setSeed} />
      </div>
      <div className="ml-auto flex items-center gap-1">{rightSlot}</div>
    </div>
  );
}
