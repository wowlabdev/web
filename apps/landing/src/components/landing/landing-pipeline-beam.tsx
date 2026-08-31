"use client";

import { useReducedMotion } from "motion/react";
import * as React from "react";

import { EMPTY_GEOMETRY, measureBeam } from "@/lib/pipeline/geometry";
import { cn } from "@wowlab/shared/lib/utils";

type LandingPipelineBeamProps = {
  className?: string;
  color?: string;
  containerRef: NodeRef;
  curvature?: number;
  delay?: number;
  duration?: number;
  fromRef: NodeRef;
  shouldClipFromCircle?: boolean;
  shouldClipToCircle?: boolean;
  toRef: NodeRef;
};

type NodeRef = React.RefObject<HTMLElement | null>;

export function LandingPipelineBeam({
  className,
  color = "var(--primary)",
  containerRef,
  curvature = 0,
  delay = 0,
  duration = 2.6,
  fromRef,
  shouldClipFromCircle = false,
  shouldClipToCircle = false,
  toRef,
}: Readonly<LandingPipelineBeamProps>) {
  const pathId = `beam-${React.useId()}`;
  const prefersReducedMotion = useReducedMotion();
  const [geometry, setGeometry] = React.useState(EMPTY_GEOMETRY);

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const measure = () => {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- geometry is measured from the live DOM via a ResizeObserver; it cannot be derived during render
      setGeometry(
        measureBeam(container, fromRef.current, toRef.current, {
          curvature,
          shouldClipFromCircle,
          shouldClipToCircle,
        }),
      );
    };

    const observer = new ResizeObserver(measure);

    observer.observe(container);
    measure();

    return () => observer.disconnect();
  }, [
    containerRef,
    curvature,
    fromRef,
    shouldClipFromCircle,
    shouldClipToCircle,
    toRef,
  ]);

  return (
    <svg
      aria-hidden
      focusable="false"
      fill="none"
      width={geometry.width}
      height={geometry.height}
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-0 stroke-2",
        className,
      )}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
    >
      <path
        d={geometry.pathD}
        id={pathId}
        stroke="currentColor"
        strokeWidth={1}
        strokeOpacity={0.2}
        strokeLinecap="round"
      />

      {prefersReducedMotion ? (
        <path
          d={geometry.pathD}
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.35}
          strokeLinecap="round"
        />
      ) : (
        geometry.pathD && (
          <>
            <BeamDot
              begin={delay}
              color={color}
              dur={duration * geometry.scale}
              glow
              pathId={pathId}
              radius={3}
            />
            <BeamDot
              begin={delay + 0.15}
              color={color}
              dur={duration * geometry.scale}
              pathId={pathId}
              radius={1.5}
            />
          </>
        )
      )}
    </svg>
  );
}

function BeamDot({
  begin,
  color,
  dur,
  glow = false,
  pathId,
  radius,
}: Readonly<{
  begin: number;
  color: string;
  dur: number;
  glow?: boolean;
  pathId: string;
  radius: number;
}>) {
  return (
    <circle
      r={radius}
      fill={color}
      fillOpacity={glow ? 1 : 0.5}
      style={glow ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
    >
      <animateMotion
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        rotate="auto"
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}
