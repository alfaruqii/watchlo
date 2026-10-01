"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo, useTransition } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Filter, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ANIME_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

export const MOVIE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
] as const;

export const MANGA_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Historical",
  "Horror",
  "Isekai",
  "Martial Arts",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

export type MediaTypeGenre = "anime" | "movie" | "manga" | "series";

interface GenreFilterProps {
  mediaType?: MediaTypeGenre;
  activeGenre?: string;
  customGenres?: readonly string[];
  title?: string;
  className?: string;
}

export default function GenreFilter({
  mediaType = "anime",
  activeGenre = "all",
  customGenres,
  title,
  className = "",
}: GenreFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const genreList = useMemo(() => {
    if (customGenres && customGenres.length > 0) return customGenres;
    switch (mediaType) {
      case "movie":
      case "series":
        return MOVIE_GENRES;
      case "manga":
        return MANGA_GENRES;
      case "anime":
      default:
        return ANIME_GENRES;
    }
  }, [mediaType, customGenres]);

  const defaultTitle = useMemo(() => {
    switch (mediaType) {
      case "movie":
        return "Film & Theatrical Genre Archive";
      case "series":
        return "Television & Series Genre Archive";
      case "manga":
        return "Manga & Manhwa Genre Archive";
      case "anime":
      default:
        return "Curated Anime Genre Archive";
    }
  }, [mediaType]);

  const displayTitle = title || defaultTitle;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [WheelGesturesPlugin()]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);
    emblaApi.on("scroll", updateScrollState);
    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
      emblaApi.off("scroll", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  // Auto-scroll to selected genre on mount or change
  useEffect(() => {
    if (!emblaApi || !activeGenre || activeGenre.toLowerCase() === "all") return;
    const targetIdx = genreList.findIndex(
      (g) => g.toLowerCase() === activeGenre.toLowerCase()
    );
    if (targetIdx >= 0) {
      // +1 to account for "All Genres" button at index 0
      emblaApi.scrollTo(targetIdx + 1);
    }
  }, [emblaApi, activeGenre, genreList]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [isPending, startTransition] = useTransition();
  const [pendingGenre, setPendingGenre] = useState<string | null>(null);

  const handleSelect = (genre: string) => {
    setPendingGenre(genre);
    const params = new URLSearchParams(searchParams.toString());
    if (genre === "all" || genre.toLowerCase() === activeGenre.toLowerCase()) {
      params.delete("genre");
    } else {
      params.set("genre", genre);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    startTransition(() => {
      router.push(`${pathname}${query}`, { scroll: false });
    });
  };

  const isFiltered = Boolean(activeGenre && activeGenre.toLowerCase() !== "all");

  return (
    <section
      aria-label={displayTitle}
      className={`relative z-10 mx-4 my-6 rounded-sm border border-hairline bg-surface-1 p-3.5 sm:mx-6 sm:p-4.5 lg:mx-10 ${className}`}
    >
      {/* 1. Header Row: Title, Counter & Action Controls */}
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-xs border border-hairline bg-surface-2 text-gold">
            <Filter className="size-3" strokeWidth={1.75} />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground truncate">
              {displayTitle}
            </span>
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline tabular-nums">
              ({genreList.length} Categories)
            </span>
          </div>
        </div>

        {/* Right Action Tools: Reset button & Carousel Slider Chevrons */}
        <div className="flex items-center gap-2 shrink-0">
          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleSelect("all")}
              className="flex h-auto items-center gap-1 rounded-xs border border-vermilion/30 bg-vermilion/10 px-2 py-0.5 font-mono text-[11px] text-vermilion hover:bg-vermilion/20 hover:border-vermilion/50 hover:text-vermilion"
            >
              <X className="size-3" />
              <span className="hidden xs:inline sm:inline">Reset Filter</span>
            </Button>
          )}

          {/* Interactive Embla Slider Control Buttons */}
          <div className="flex items-center gap-1 rounded-xs border border-hairline bg-surface-2 p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Scroll left"
              className="size-6 rounded-2xs text-muted-foreground hover:bg-surface-3 hover:text-gold disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Scroll right"
              className="size-6 rounded-2xs text-muted-foreground hover:bg-surface-3 hover:text-gold disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Component-driven Slider Viewport with Embla Carousel */}
      <div className="relative overflow-hidden">
        {/* Subtle left gradient edge indicator */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-surface-1 to-transparent transition-opacity duration-200 ${
            canScrollPrev ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Subtle right gradient edge indicator */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-surface-1 to-transparent transition-opacity duration-200 ${
            canScrollNext ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Embla Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2 touch-pan-y select-none py-0.5">
            {/* All Genres Anchor Button */}
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => handleSelect("all")}
              className={`shrink-0 flex items-center gap-1.5 h-auto rounded-xs border px-3 py-1 font-mono text-xs transition-colors ${
                !isFiltered
                  ? "border-gold bg-gold/15 text-gold font-bold shadow-xs hover:bg-gold/20 hover:text-gold"
                  : "border-hairline bg-surface-2 text-muted-foreground hover:border-gold/40 hover:text-foreground hover:bg-surface-3"
              } ${isPending && pendingGenre === "all" ? "opacity-75" : ""}`}
            >
              {isPending && pendingGenre === "all" && (
                <Loader2 className="size-3 animate-spin text-gold" />
              )}
              <span>All Genres</span>
            </Button>

            {/* Individual Genre Filter Slides */}
            {genreList.map((genre) => {
              const isActive = activeGenre.toLowerCase() === genre.toLowerCase();
              const isItemPending = isPending && pendingGenre === genre;
              return (
                <Button
                  key={genre}
                  type="button"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => handleSelect(genre)}
                  className={`shrink-0 flex items-center gap-1.5 h-auto rounded-xs border px-3 py-1 font-mono text-xs transition-colors ${
                    isActive
                      ? "border-gold bg-gold/15 text-gold font-bold shadow-xs hover:bg-gold/20 hover:text-gold"
                      : "border-hairline bg-surface-2 text-muted-foreground hover:border-gold/40 hover:text-foreground hover:bg-surface-3"
                  } ${isItemPending ? "opacity-75" : ""}`}
                >
                  {isItemPending && (
                    <Loader2 className="size-3 animate-spin text-gold" />
                  )}
                  <span>{genre}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
