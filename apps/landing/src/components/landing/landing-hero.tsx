"use client";

import type { ReactNode } from "react";

import { ArrowRightIcon, PlayIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { LandingHeroPipelineSection } from "@/components/landing/landing-hero-pipeline-section";
import { BunnyVideo } from "@wowlab/shared/components/common/bunny-video";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@wowlab/shared/components/ui/dialog";
import { Link } from "@wowlab/shared/components/ui/link";
import { env } from "@wowlab/shared/lib/env";

type LandingHeroProps = {
  badge?: ReactNode;
  demoLabel?: ReactNode;
  description?: ReactNode;
  primaryHref: string;
  primaryLabel: ReactNode;
  secondaryHref?: string;
  secondaryLabel?: ReactNode;
  title: ReactNode;
};

const DEMO_VIDEO_ID = "4d0f242f-ae61-47bb-ba1c-85e3c18f4443";

export function LandingHero({
  badge,
  demoLabel,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  title,
}: Readonly<LandingHeroProps>) {
  const content = useIntlayer("landingPage");
  const isPrimaryExternal = /^https?:\/\//.test(primaryHref);
  const isSecondaryExternal =
    secondaryHref !== undefined && /^https?:\/\//.test(secondaryHref);

  return (
    <section className="relative flex-1 overflow-hidden py-8 sm:py-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 sm:gap-14 sm:px-6 lg:gap-16 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {badge ? (
            <Badge
              variant="outline"
              className="border-primary/30 bg-background/70 text-sm font-normal shadow-sm backdrop-blur"
            >
              {badge}
            </Badge>
          ) : null}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-7xl lg:font-bold">
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground max-w-2xl text-lg text-balance md:text-xl">
              {description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" className="group has-[>svg]:px-6" asChild>
              {isPrimaryExternal ? (
                <a href={primaryHref}>
                  {primaryLabel}
                  <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              )}
            </Button>
            {demoLabel ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 bg-background/70 text-primary shadow-sm backdrop-blur hover:bg-primary/10"
                  >
                    <PlayIcon />
                    {demoLabel}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl gap-0 p-0 sm:max-w-5xl">
                  <DialogHeader className="sr-only">
                    <DialogTitle>{demoLabel}</DialogTitle>
                  </DialogHeader>
                  <BunnyVideo
                    libraryId={env.BUNNY_STREAM_LIBRARY_ID}
                    title={
                      typeof demoLabel === "string"
                        ? demoLabel
                        : content.heroDemoVideoTitle.value
                    }
                    videoId={DEMO_VIDEO_ID}
                  />
                </DialogContent>
              </Dialog>
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <Button
                size="lg"
                asChild
                className="border border-primary/20 bg-background/70 text-primary shadow-sm backdrop-blur hover:bg-primary/10"
              >
                {isSecondaryExternal ? (
                  <a href={secondaryHref}>{secondaryLabel}</a>
                ) : (
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                )}
              </Button>
            ) : null}
          </div>
        </div>

        <LandingHeroPipelineSection />
      </div>
    </section>
  );
}
