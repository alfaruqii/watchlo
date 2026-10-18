"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/../lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts = {
        align: "start",
        dragFree: true,
        containScroll: "trimSnaps",
      },
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const defaultPlugins = React.useMemo(() => {
      if (plugins) return plugins;
      return [WheelGesturesPlugin()];
    }, [plugins]);

    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      defaultPlugins
    );

    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      if (!emblaApi) return;
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      api.on("scroll", onSelect);

      return () => {
        api.off("select", onSelect);
        api.off("reInit", onSelect);
        api.off("scroll", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex touch-pan-y select-none",
          orientation === "horizontal" ? "-ml-3" : "-mt-3 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0",
        orientation === "horizontal" ? "pl-3" : "pt-3",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Previous slide"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        "flex size-6 items-center justify-center rounded-2xs text-muted-foreground transition-colors hover:bg-surface-3 hover:text-gold disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none",
        className
      )}
      {...props}
    >
      <ChevronLeft className="size-3.5" />
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Next slide"
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        "flex size-6 items-center justify-center rounded-2xs text-muted-foreground transition-colors hover:bg-surface-3 hover:text-gold disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none",
        className
      )}
      {...props}
    >
      <ChevronRight className="size-3.5" />
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

const CarouselNavigation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-1 rounded-xs border border-hairline bg-surface-2 p-0.5 shrink-0",
        className
      )}
      {...props}
    >
      <CarouselPrevious />
      <CarouselNext />
    </div>
  );
});
CarouselNavigation.displayName = "CarouselNavigation";

const CarouselFadeMask = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { fromColor?: string }
>(({ className, fromColor = "from-surface-1", ...props }, ref) => {
  const { canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div ref={ref} className={cn("pointer-events-none", className)} {...props}>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r to-transparent transition-opacity duration-200",
          fromColor,
          canScrollPrev ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l to-transparent transition-opacity duration-200",
          fromColor,
          canScrollNext ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
});
CarouselFadeMask.displayName = "CarouselFadeMask";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselNavigation,
  CarouselFadeMask,
  useCarousel,
};
