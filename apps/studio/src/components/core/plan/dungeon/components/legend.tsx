"use client";

import { useIntlayer } from "next-intlayer";

import { ENEMY_FILL, PACK_FILL, PATROL_STROKE, PULL_PALETTE } from "../palette";

type LegendRowProps = {
  color: string;
  label: string;
  isDashed?: boolean;
};

const LEGEND_ROWS: ReadonlyArray<{
  color: string;
  isDashed?: boolean;
  labelKey:
    | "dungeonLegendMob"
    | "dungeonLegendPack"
    | "dungeonLegendPatrol"
    | "dungeonLegendPull";
}> = [
  { color: PACK_FILL, labelKey: "dungeonLegendPack" },
  { color: PULL_PALETTE[0], labelKey: "dungeonLegendPull" },
  { color: PATROL_STROKE, isDashed: true, labelKey: "dungeonLegendPatrol" },
  { color: ENEMY_FILL, labelKey: "dungeonLegendMob" },
];

export function Legend() {
  const content = useIntlayer("plan");

  return (
    <div className="bg-background/80 absolute bottom-3 left-3 flex flex-col gap-1 border border-border p-2 text-[10px] backdrop-blur">
      {LEGEND_ROWS.map(({ color, isDashed, labelKey }) => (
        <LegendRow
          key={labelKey}
          color={color}
          isDashed={isDashed}
          label={content[labelKey].value}
        />
      ))}
    </div>
  );
}

function LegendRow({ color, isDashed, label }: Readonly<LegendRowProps>) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-2 w-6"
        style={{
          backgroundColor: isDashed ? "transparent" : color,
          borderTop: isDashed ? `2px dashed ${color}` : undefined,
        }}
      />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
