"use client";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Disc } from "lucide-react";
import HeroMedia from "./HeroMedia";
import { Button } from "@/components/ui/button";
import { MovieInfo } from "@/types/movies.type";
import { Anime } from "@/types/anime.type";
import { MangaItem } from "@/types/manga.type";

type Media = Anime | MovieInfo | MangaItem;

type MediaCarouselProps = {
  items: Media[];
};

export default function HeroMediaCarousel({ items }: MediaCarouselProps) {
  const featuredItems = items?.slice(0, 8) ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    WheelGesturesPlugin(),
    Autoplay({ delay: 6500, stopOnInteraction: false }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, featuredItems.length, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const getItemTitle = (item: Media): string => {
    if (typeof item.title !== "string") {
      return (
        item.title?.userPreferred ||
        item.title?.english ||
        item.title?.romaji ||
        "Untitled Edition"
      );
    }
    return item.title || "Untitled Edition";
  };

  const getItemYear = (item: Media): string => {
    if ("release_date" in item && item.release_date) {
      return String(new Date(item.release_date).getFullYear());
    }
    if ("seasonYear" in item && item.seasonYear) {
      return String(item.seasonYear);
    }
    if ("year" in item && item.year) {
      return String(item.year);
    }
    return "ARCHIVE";
  };

  const getItemScore = (item: Media): string => {
    if ("vote_average" in item && typeof item.vote_average === "number") {
      return item.vote_average.toFixed(1);
    }
    if ("score" in item && item.score) {
      if (typeof item.score.decimalScore === "number") {
        return item.score.decimalScore.toFixed(1);
      }
      if (typeof item.score.averageScore === "number") {
        return (item.score.averageScore / 10).toFixed(1);
      }
    }
    if ("averageScore" in item && typeof item.averageScore === "number") {
      return (item.averageScore / 10).toFixed(1);
    }
    return "NR";
  };

  const getItemPoster = (item: Media): string => {
    if ("poster_path" in item && item.poster_path && item.poster_path.trim()) {
      return item.poster_path;
    }
    if ("coverImage" in item && item.coverImage) {
      return (
        item.coverImage.extraLarge ||
        item.coverImage.large ||
        item.coverImage.medium ||
        "/fallback-card.webp"
      );
    }
    return "/fallback-card.webp";
  };

  return (
    <section
      aria-label="Featured collector editions"
      className="border-b border-hairline bg-surface-1/60 px-4 py-5 sm:px-6 lg:px-10 lg:py-8"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        {/* Main Embla Collector Showcase (9 cols on desktop) */}
        <div className="relative overflow-hidden rounded-sm border border-hairline bg-surface-1 lg:col-span-9">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {featuredItems.map((item, idx) => (
                <HeroMedia
                  key={item.id}
                  id={item.id}
                  spineNumber={idx + 1}
                  year={getItemYear(item)}
                  score={getItemScore(item)}
                  title={getItemTitle(item)}
                  description={
                    "description" in item && item.description
                      ? item.description
                      : "overview" in item && (item as MovieInfo).overview
                      ? (item as MovieInfo).overview ?? "No archival synopsis available."
                      : "No archival synopsis available."
                  }
                  bannerImage={
                    "backdrop_path" in item
                      ? item.backdrop_path
                      : item.bannerImage ??
                        item.coverImage?.extraLarge ??
                        "/fallback-banner.webp"
                  }
                  coverImage={getItemPoster(item)}
                  genres={
                    "genre_names" in item ? item.genre_names : item.genres
                  }
                />
              ))}
            </div>
          </div>

          {/* Precision Corner Controls */}
          <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-1 p-1 shadow-sleeve">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={scrollPrev}
              aria-label="Previous edition"
              className="size-7 rounded-sm text-foreground hover:bg-surface-2 hover:text-gold"
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} />
            </Button>
            <span className="px-2 font-mono text-[11px] text-muted-foreground tabular-nums">
              {String(selectedIndex + 1).padStart(2, "0")} /{" "}
              {String(featuredItems.length).padStart(2, "0")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={scrollNext}
              aria-label="Next edition"
              className="size-7 rounded-sm text-foreground hover:bg-surface-2 hover:text-gold"
            >
              <ChevronRight className="size-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>

        {/* Right Interactive Edition Reel Index (3 cols on desktop) */}
        <aside
          aria-label="Edition reel selector"
          className="flex flex-col justify-between rounded-sm border border-hairline bg-surface-1 p-3.5 lg:col-span-3"
        >
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2">
            <div className="flex items-center gap-2">
              <Disc className="size-3.5 shrink-0 text-gold" strokeWidth={1.75} />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                EDITION REEL
              </span>
            </div>
            <span className="shrink-0 whitespace-nowrap font-mono text-[10px] text-muted-foreground tabular-nums sm:text-[11px]">
              SPINE #01–#{String(featuredItems.length).padStart(2, "0")}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {featuredItems.slice(0, 6).map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const itemTitle = getItemTitle(item);
              return (
                <Button
                  key={item.id}
                  type="button"
                  variant="ghost"
                  onClick={() => scrollTo(idx)}
                  className={`group flex h-auto min-w-[210px] items-center gap-3 rounded-sm border p-2 text-left justify-start transition-all duration-200 lg:min-w-0 ${
                    isSelected
                      ? "border-gold bg-surface-2 shadow-sm hover:bg-surface-2"
                      : "border-transparent bg-transparent hover:border-hairline hover:bg-surface-2/60"
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-semibold tabular-nums ${
                      isSelected
                        ? "text-gold"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded-sm border border-hairline bg-surface-3">
                    <Image
                      unoptimized
                      src={getItemPoster(item)}
                      alt={itemTitle}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`line-clamp-1 font-display text-xs font-semibold ${
                        isSelected ? "text-gold" : "text-foreground"
                      }`}
                    >
                      {itemTitle}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground tabular-nums">
                      <span>{getItemYear(item)}</span>
                      <span>·</span>
                      <span className="text-gold">★ {getItemScore(item)}</span>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
