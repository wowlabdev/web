"use client";

import { GameIcon } from "@/components/shared/game";
import { useSpellSummary } from "@/lib/game-data";

type AuraLaneIconProps = {
  auraId: number;
  label: string;
};

export function AuraLaneIcon({ auraId, label }: Readonly<AuraLaneIconProps>) {
  const { data } = useSpellSummary(auraId);
  const fileName = data?.file_name;

  if (!fileName) {
    return <span className="block size-[18px] rounded-sm bg-muted" />;
  }

  return <GameIcon alt={label} iconName={fileName} size="sm" />;
}

/** Placeholder swatch for lanes without a resolvable game icon (system auras). */
export function AuraLanePlaceholder({ color }: Readonly<{ color: string }>) {
  return (
    <span
      className="block size-[18px] rounded-sm"
      style={{ backgroundColor: color }}
    />
  );
}
