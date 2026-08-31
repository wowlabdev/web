"use client";

import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  type TargetAndTransition,
  type Transition,
  useInView,
  type UseInViewOptions,
  useReducedMotion,
} from "motion/react";
import * as React from "react";

type MotionComponent = keyof typeof motion;

type MotionPresetProps = {
  blur?: boolean | string;
  children?: React.ReactNode;
  className?: string;
  component?: MotionComponent;
  delay?: number;
  fade?: boolean | { initialOpacity?: number; opacity?: number };
  inView?: boolean;
  inViewMargin?: NonNullable<UseInViewOptions["margin"]>;
  inViewOnce?: boolean;
  motionProps?: Omit<
    HTMLMotionProps<"div">,
    "children" | "className" | "ref" | "transition"
  >;
  ref?: React.Ref<HTMLDivElement>;
  slide?:
    | boolean
    | {
        direction?: "down" | "left" | "right" | "up";
        offset?: number;
      };
  transition?: Transition;
  zoom?:
    | boolean
    | {
        initialScale?: number;
        scale?: number;
      };
};

const DEFAULT_SLIDE_OFFSET = 16;
const DEFAULT_TRANSITION: Transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
};

type BuildVariantsInput = {
  prefersReducedMotion: boolean;
} & Pick<MotionPresetProps, "blur" | "fade" | "slide" | "zoom">;

function applyFade(
  hidden: TargetAndTransition,
  visible: TargetAndTransition,
  fade: MotionPresetProps["fade"],
): void {
  if (!fade) {
    return;
  }

  hidden.opacity = fade === true ? 0 : (fade.initialOpacity ?? 0);
  visible.opacity = fade === true ? 1 : (fade.opacity ?? 1);
}

function applySlide(
  hidden: TargetAndTransition,
  visible: TargetAndTransition,
  slide: MotionPresetProps["slide"],
): void {
  if (!slide) {
    return;
  }

  const offset =
    slide === true
      ? DEFAULT_SLIDE_OFFSET
      : (slide.offset ?? DEFAULT_SLIDE_OFFSET);
  const direction = slide === true ? "up" : (slide.direction ?? "up");
  const axis = direction === "up" || direction === "down" ? "y" : "x";

  hidden[axis] = direction === "left" || direction === "up" ? -offset : offset;
  visible[axis] = 0;
}

function applyZoom(
  hidden: TargetAndTransition,
  visible: TargetAndTransition,
  zoom: MotionPresetProps["zoom"],
): void {
  if (!zoom) {
    return;
  }

  hidden.scale = zoom === true ? 0.96 : (zoom.initialScale ?? 0.96);
  visible.scale = zoom === true ? 1 : (zoom.scale ?? 1);
}

function buildVariants(input: BuildVariantsInput): {
  hiddenVariant: TargetAndTransition;
  visibleVariant: TargetAndTransition;
} {
  const { blur, fade, prefersReducedMotion, slide, zoom } = input;
  const hiddenVariant: TargetAndTransition = {};
  const visibleVariant: TargetAndTransition = {};

  if (!prefersReducedMotion) {
    if (blur) {
      hiddenVariant.filter = blur === true ? "blur(6px)" : `blur(${blur})`;
      visibleVariant.filter = "blur(0px)";
    }

    applySlide(hiddenVariant, visibleVariant, slide);
    applyZoom(hiddenVariant, visibleVariant, zoom);
  }

  applyFade(hiddenVariant, visibleVariant, fade);

  return { hiddenVariant, visibleVariant };
}

function MotionPreset({
  blur = false,
  children,
  className,
  component = "div",
  delay = 0,
  fade = false,
  inView = true,
  inViewMargin = "0px",
  inViewOnce = true,
  motionProps = {},
  ref,
  slide = false,
  transition = DEFAULT_TRANSITION,
  zoom = false,
}: Readonly<MotionPresetProps>) {
  const localRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  const inViewResult = useInView(localRef, {
    margin: inViewMargin,
    once: inViewOnce,
  });

  const isInView = !inView || inViewResult;

  const { hiddenVariant, visibleVariant } = buildVariants({
    blur,
    fade,
    prefersReducedMotion: prefersReducedMotion ?? false,
    slide,
    zoom,
  });

  const MotionComponent = motion[component] as typeof motion.div;

  const resolvedTransition = prefersReducedMotion
    ? { duration: 0.2, ease: "linear" as const }
    : {
        ...transition,
        delay: (transition.delay ?? 0) + delay,
      };

  return (
    <AnimatePresence>
      <MotionComponent
        ref={localRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={{
          hidden: hiddenVariant,
          visible: visibleVariant,
        }}
        transition={resolvedTransition}
        className={className}
        {...motionProps}
      >
        {children}
      </MotionComponent>
    </AnimatePresence>
  );
}

export { MotionPreset, type MotionPresetProps };
