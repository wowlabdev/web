"use client";

import type { ReactNode } from "react";

import { useInterval } from "ahooks";
import { useReducedMotion } from "motion/react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import Image from "next/image";
import { createElement, useRef, useState } from "react";

import { LandingPipelineBeam } from "@/components/landing/landing-pipeline-beam";
import { makeIconUrl } from "@wowlab/shared/lib/links";
import { getIcon, routes } from "@wowlab/shared/lib/routing";
import { cn } from "@wowlab/shared/lib/utils";

type GearItem = {
  alt: string;
  file: string;
  isLarge?: boolean;
};

type OutputIconName = (typeof routes)["simulate"]["bags"]["icon"];

type OutputItem = {
  colorClass: string;
  iconName: OutputIconName;
};

const GEAR: readonly GearItem[] = [
  { alt: "Ashbringer", file: "inv_sword_2h_artifactashbringer_d_01" },
  { alt: "Warglaive of Azzinoth", file: "inv_weapon_glave_01", isLarge: true },
  { alt: "Shadowmourne", file: "inv_axe_113" },
];

const OUTPUTS: readonly OutputItem[] = [
  { colorClass: "text-emerald-400", iconName: routes.simulate.bags.icon },
  { colorClass: "text-primary", iconName: routes.simulate.drops.icon },
  { colorClass: "text-amber-400", iconName: routes.rankings.index.icon },
];

const ROWS = [0, 1, 2] as const;
const ROW_CURVATURE = [-25, 0, 25] as const;
const BEAM_DURATION = 3;
const beamDelay = (row: number) => (row * BEAM_DURATION) / 3;

export function LandingHeroPipelineSection() {
  const content = useIntlayer("landingPage");
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const inTopRef = useRef<HTMLDivElement>(null);
  const inMidRef = useRef<HTMLDivElement>(null);
  const inBotRef = useRef<HTMLDivElement>(null);
  const outTopRef = useRef<HTMLDivElement>(null);
  const outMidRef = useRef<HTMLDivElement>(null);
  const outBotRef = useRef<HTMLDivElement>(null);
  const inRefs = [inTopRef, inMidRef, inBotRef];
  const outRefs = [outTopRef, outMidRef, outBotRef];

  const outputLabels: readonly ReactNode[] = [
    content.heroOutputBib,
    content.heroOutputDrops,
    content.heroOutputRankings,
  ];

  return (
    <div className="flex w-full max-w-5xl flex-col">
      <div
        ref={containerRef}
        className="relative isolate grid min-h-[300px] grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden rounded-3xl border border-border/60 bg-background/70 px-4 pt-8 pb-16 shadow-2xl shadow-primary/10 backdrop-blur sm:px-10 md:min-h-[340px] md:pt-10"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.08),transparent)]" />
        <div className="absolute left-1/2 top-1/2 -z-10 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-4 justify-self-start">
          {GEAR.map((gear, row) => (
            <GearNode
              key={gear.file}
              alt={gear.alt}
              file={gear.file}
              isLarge={gear.isLarge}
              nodeRef={inRefs[row]}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-self-center">
          <div className="relative">
            <div
              ref={centerRef}
              className="relative flex size-20 items-center justify-center md:size-24"
            >
              <Image
                src="/logo.png"
                alt={content.heroLogoAlt.value}
                width={414}
                height={414}
                priority
                className="size-full"
              />
            </div>
            <SimsCounter />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-end justify-between gap-4 justify-self-end">
          {OUTPUTS.map((output, row) => (
            <OutputPill
              key={output.iconName}
              colorClass={output.colorClass}
              iconName={output.iconName}
              label={outputLabels[row]}
              nodeRef={outRefs[row]}
            />
          ))}
        </div>

        {ROWS.map((row) => (
          <LandingPipelineBeam
            key={`in-${row}`}
            containerRef={containerRef}
            curvature={ROW_CURVATURE[row]}
            delay={beamDelay(row)}
            duration={BEAM_DURATION}
            fromRef={inRefs[row]}
            shouldClipToCircle
            toRef={centerRef}
          />
        ))}
        {ROWS.map((row) => (
          <LandingPipelineBeam
            key={`out-${row}`}
            containerRef={containerRef}
            curvature={ROW_CURVATURE[row]}
            delay={beamDelay(row)}
            duration={BEAM_DURATION}
            fromRef={centerRef}
            shouldClipFromCircle
            toRef={outRefs[row]}
          />
        ))}
      </div>
    </div>
  );
}

function GearNode({
  alt,
  file,
  isLarge = false,
  nodeRef,
}: Readonly<{
  alt: string;
  file: string;
  isLarge?: boolean;
  nodeRef: React.RefObject<HTMLDivElement | null>;
}>) {
  return (
    <div
      ref={nodeRef}
      className={cn(
        "relative flex items-center justify-center rounded-xl border bg-background p-1.5 shadow-md",
        isLarge ? "size-16 md:size-20" : "size-12 md:size-14",
      )}
    >
      <Image
        src={makeIconUrl(file, "medium")}
        alt={alt}
        width={64}
        height={64}
        className="size-full rounded-md object-cover"
      />
    </div>
  );
}

function OutputPill({
  colorClass,
  iconName,
  label,
  nodeRef,
}: Readonly<{
  colorClass: string;
  iconName: OutputIconName;
  label: ReactNode;
  nodeRef: React.RefObject<HTMLDivElement | null>;
}>) {
  return (
    <div
      ref={nodeRef}
      className="relative flex items-center gap-1.5 rounded-xl border bg-background px-2.5 py-1.5 shadow-md sm:gap-2 sm:px-3 sm:py-2 md:gap-2.5 md:px-4 md:py-2.5"
    >
      {createElement(getIcon(iconName), {
        className: cn("size-4 shrink-0 sm:size-5 md:size-6", colorClass),
      })}
      <span className="text-xs font-medium text-foreground sm:text-sm md:text-base">
        {label}
      </span>
    </div>
  );
}

function SimsCounter() {
  const content = useIntlayer("landingPage");
  const prefersReducedMotion = useReducedMotion();
  const fmtNumber = useNumber();
  const [value, setValue] = useState(14_203);

  useInterval(
    () => {
      setValue((v) => v + Math.floor(Math.random() * 7) + 1);
    },
    prefersReducedMotion ? undefined : 520,
  );

  return (
    <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
      <span className="tabular-nums text-primary">{fmtNumber(value)}</span>{" "}
      {content.heroSimsToday}
    </div>
  );
}
