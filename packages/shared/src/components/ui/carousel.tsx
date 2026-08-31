"use client";

import { useMemoizedFn } from "ahooks";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import * as React from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import { cn } from "@wowlab/shared/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: NonNullable<CarouselOptions>;
  plugins?: NonNullable<CarouselPlugin>;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function Carousel({
  children,
  className,
  opts,
  orientation = "horizontal",
  plugins,
  setApi,
  ...props
}: CarouselProps & React.ComponentProps<"div">) {
  const content = useIntlayer("commonComponents");
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const initialScrollable = opts?.loop ?? false;
  const [canScrollPrev, setCanScrollPrev] = React.useState(initialScrollable);
  const [canScrollNext, setCanScrollNext] = React.useState(initialScrollable);

  const onSelect = useMemoizedFn((api: CarouselApi) => {
    if (!api) {
      return;
    }

    // eslint-disable-next-line @eslint-react/set-state-in-effect -- syncing state from the embla carousel imperative API (select/reInit events + mount)
    setCanScrollPrev(api.canScrollPrev());
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- syncing state from the embla carousel imperative API (select/reInit events + mount)
    setCanScrollNext(api.canScrollNext());
  });

  const scrollPrev = useMemoizedFn(() => {
    api?.scrollPrev();
  });

  const scrollNext = useMemoizedFn(() => {
    api?.scrollNext();
  });

  const handleKeyDown = useMemoizedFn(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
  );

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext
      value={{
        api: api,
        canScrollNext,
        canScrollPrev,
        carouselRef,
        opts,
        orientation,
        scrollNext,
        scrollPrev,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription={content.carousel.value}
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const content = useIntlayer("commonComponents");
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription={content.slide.value}
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

function CarouselNext({
  className,
  size = "icon-sm",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button>) {
  const content = useIntlayer("commonComponents");
  const { canScrollNext, orientation, scrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon />
      <span className="sr-only">{content.nextSlide}</span>
    </Button>
  );
}

function CarouselPrevious({
  className,
  size = "icon-sm",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button>) {
  const content = useIntlayer("commonComponents");
  const { canScrollPrev, orientation, scrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="sr-only">{content.previousSlide}</span>
    </Button>
  );
}

function useCarousel() {
  const context = React.use(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
};
