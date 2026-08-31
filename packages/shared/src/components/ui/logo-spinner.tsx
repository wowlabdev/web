"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import {
  LOGO_VIEW_BOX,
  LogoGlyph,
  type LogoTone,
} from "@wowlab/shared/components/ui/logo-mark";
import { cn } from "@wowlab/shared/lib/utils";

const SPIN_DURATION = 2.08;

export function LogoSpinner({
  "aria-label": ariaLabel = "Loading",
  className,
  tone = "gradient",
  ...props
}: Readonly<
  { tone?: LogoTone } & Omit<React.ComponentProps<typeof motion.svg>, "viewBox">
>) {
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <motion.svg
      viewBox={LOGO_VIEW_BOX}
      role="img"
      aria-label={ariaLabel}
      className={cn("size-5", className)}
      style={{ transformOrigin: "center" }}
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: SPIN_DURATION, ease: "linear", repeat: Infinity }}
      {...props}
    >
      <LogoGlyph id={id} tone={tone} />
    </motion.svg>
  );
}
