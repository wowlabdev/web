import { MotionPreset } from "@wowlab/shared/components/ui/motion-preset";

import { LandingBentoCard, type LandingBentoCell } from "./landing-bento-card";

export function LandingBento({
  cells,
  description,
  eyebrow,
  title,
}: Readonly<{
  cells: [
    LandingBentoCell,
    LandingBentoCell,
    LandingBentoCell,
    LandingBentoCell,
  ];
  description?: string;
  eyebrow?: string;
  title?: string;
}>) {
  const [topLeft, topMiddle, topRight, wide] = cells;

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-10 text-white sm:py-12 lg:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_32rem)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || description) && (
          <MotionPreset fade slide className="relative mb-8 max-w-6xl sm:mb-10">
            <div>
              {eyebrow && (
                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  {title}
                </h2>
              )}
            </div>
            {description && (
              <p className="mt-4 max-w-5xl text-base leading-7 text-white/65 lg:text-lg">
                {description}
              </p>
            )}
          </MotionPreset>
        )}
      </div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        <MotionPreset fade slide className="flex">
          <LandingBentoCard cell={topLeft} />
        </MotionPreset>
        <MotionPreset fade slide delay={0.06} className="flex">
          <LandingBentoCard cell={topMiddle} />
        </MotionPreset>
        <MotionPreset fade slide delay={0.12} className="flex">
          <LandingBentoCard cell={topRight} />
        </MotionPreset>
        <MotionPreset fade slide delay={0.18} className="flex md:col-span-3">
          <LandingBentoCard cell={wide} />
        </MotionPreset>
      </div>
    </section>
  );
}
