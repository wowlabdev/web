"use client";

import type { ReactNode } from "react";

import { useCreation, useMemoizedFn, useUpdateEffect } from "ahooks";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import Image from "next/image";
import { createContext, use, useEffect, useMemo, useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@wowlab/shared/components/ui/carousel";
import { cn } from "@wowlab/shared/lib/utils";

const SLIDE_SOURCES = [
  "/addon/preview-1.png",
  "/addon/preview-2.png",
  "/addon/preview-3.png",
  "/addon/preview-4.png",
  "/addon/preview-5.png",
  "/addon/preview-6.png",
] as const;

type AddonPreviewContextValue = {
  selected: number;
  setSelected: (i: number) => void;
  slides: Slide[];
};

type Slide = { description: string; src: string; title: string };

const AddonPreviewContext = createContext<AddonPreviewContextValue | null>(
  null,
);

export function AddonPreviewCarousel({
  className,
  renderOverlay,
}: Readonly<{
  className?: string;
  renderOverlay?: (expanded: ReactNode) => ReactNode;
}>) {
  const { slides } = useAddonPreview();
  const [api, setApi] = useState<CarouselApi>();

  useEmblaSync(api);
  const opts = useCreation(() => ({ loop: true }), []);

  return (
    <Carousel className={cn("w-full", className)} opts={opts} setApi={setApi}>
      <div className="relative">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.src}>
              <div className="overflow-hidden border border-white/20 bg-background shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)]">
                <Image
                  alt={slide.title}
                  className="h-auto w-full"
                  height={691}
                  priority={index === 0}
                  src={slide.src}
                  width={1025}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {renderOverlay
          ? renderOverlay(
              <AddonPreviewExpanded contentClassName="p-6 sm:p-10" />,
            )
          : null}
      </div>
      <div className="mt-4">
        <AddonNav slides={slides} />
      </div>
    </Carousel>
  );
}

export function AddonPreviewExpanded({
  className,
  contentClassName,
}: Readonly<{
  className?: string;
  contentClassName?: string;
}>) {
  const { selected, slides } = useAddonPreview();
  const [api, setApi] = useState<CarouselApi>();

  useEmblaSync(api);
  const opts = useCreation(() => ({ loop: true, startIndex: selected }), []);

  return (
    <Carousel className={cn("w-full", className)} opts={opts} setApi={setApi}>
      <div
        className={cn(
          "grid items-center gap-6 lg:grid-cols-[3fr_2fr] lg:gap-10",
          contentClassName,
        )}
      >
        <div className="flex flex-col gap-4">
          <CarouselContent>
            {slides.map((s, index) => (
              <CarouselItem key={s.src}>
                <div className="overflow-hidden border border-white/20 bg-background shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)]">
                  <Image
                    alt={s.title}
                    className="h-auto w-full"
                    height={691}
                    priority={index === 0}
                    src={s.src}
                    width={1025}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <AddonNav slides={slides} />
        </div>
        <AddonSlideInfo className="self-start" />
      </div>
    </Carousel>
  );
}

export function AddonPreviewScope({
  children,
}: Readonly<{ children: ReactNode }>) {
  const slides = useSlides();
  const [selected, setSelected] = useState(0);
  const value = useMemo(
    () => ({ selected, setSelected, slides }),
    [selected, slides],
  );

  return <AddonPreviewContext value={value}>{children}</AddonPreviewContext>;
}

export function AddonSlideInfo({
  className,
}: Readonly<{ className?: string }>) {
  const { selected, slides } = useAddonPreview();
  const content = useIntlayer("addonPage");
  const slide = slides[selected];

  return (
    <div className={cn("flex flex-col gap-3 lg:gap-4", className)}>
      <p className="text-xs font-medium uppercase tracking-widest text-primary">
        {content.slideCounter({
          current: selected + 1,
          total: slides.length,
        })}
      </p>
      <h3 className="text-xl font-semibold lg:text-2xl">{slide.title}</h3>
      <p className="text-base leading-relaxed text-muted-foreground">
        {slide.description}
      </p>
    </div>
  );
}

function AddonNav({ slides }: Readonly<{ slides: Slide[] }>) {
  const { selected, setSelected } = useAddonPreview();
  const content = useIntlayer("addonPage");
  const { canScrollNext, canScrollPrev, scrollNext, scrollPrev } =
    useCarousel();

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        aria-label={content.previousSlide.value}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        size="icon-sm"
        variant="outline"
      >
        <ChevronLeftIcon />
      </Button>
      <div className="flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            aria-label={content.goToSlide({ n: i + 1 }).value}
            className={cn(
              "size-1.5 rounded-full transition-all",
              i === selected
                ? "w-4 bg-primary"
                : "bg-muted-foreground/40 hover:bg-muted-foreground/60",
            )}
            key={slide.src}
            onClick={() => setSelected(i)}
            type="button"
          />
        ))}
      </div>
      <Button
        aria-label={content.nextSlide.value}
        disabled={!canScrollNext}
        onClick={scrollNext}
        size="icon-sm"
        variant="outline"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

function useAddonPreview() {
  const ctx = use(AddonPreviewContext);

  if (!ctx) {
    throw new Error(
      "Addon preview components must be wrapped in <AddonPreviewScope>",
    );
  }

  return ctx;
}

function useEmblaSync(api: CarouselApi | undefined) {
  const { selected, setSelected } = useAddonPreview();
  const handleSelect = useMemoizedFn((i: number) => setSelected(i));

  useEffect(() => {
    if (!api) {
      return;
    }

    const handler = () => handleSelect(api.selectedScrollSnap());

    api.on("select", handler);
    api.on("reInit", handler);

    return () => {
      api.off("select", handler);
      api.off("reInit", handler);
    };
  }, [api, handleSelect]);
  useUpdateEffect(() => {
    if (api && api.selectedScrollSnap() !== selected) {
      api.scrollTo(selected, true);
    }
  }, [selected, api]);
}

function useSlides(): Slide[] {
  const content = useIntlayer("addonPage");

  return useMemo(
    () => [
      {
        description: content.slide1Description.value,
        src: SLIDE_SOURCES[0],
        title: content.slide1Title.value,
      },
      {
        description: content.slide2Description.value,
        src: SLIDE_SOURCES[1],
        title: content.slide2Title.value,
      },
      {
        description: content.slide3Description.value,
        src: SLIDE_SOURCES[2],
        title: content.slide3Title.value,
      },
      {
        description: content.slide4Description.value,
        src: SLIDE_SOURCES[3],
        title: content.slide4Title.value,
      },
      {
        description: content.slide5Description.value,
        src: SLIDE_SOURCES[4],
        title: content.slide5Title.value,
      },
      {
        description: content.slide6Description.value,
        src: SLIDE_SOURCES[5],
        title: content.slide6Title.value,
      },
    ],
    [content],
  );
}
