"use client";

import { Sparkles } from "lucide-react";
import AnimeCard from "./AnimeCard";
import { AnimeType, RelationOrRecommendation } from "@/types/anime.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselFadeMask,
} from "@/components/ui/carousel";

interface AnimeContainerProps {
  animes: AnimeType[] | RelationOrRecommendation[];
  containerTitle: string;
}

const AnimeContainerCard = ({
  animes,
  containerTitle,
}: AnimeContainerProps) => {
  return (
    <section className="overflow-hidden pt-6 pb-2 sm:px-6 lg:px-10">
      <Carousel className="w-full">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-hairline pb-2.5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            <Sparkles className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
            <span>{containerTitle}</span>
          </h2>
          <div className="flex items-center gap-2.5">
            <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums sm:text-[11px]">
              {animes?.length ?? 0} EDITIONS
            </span>
            <CarouselNavigation />
          </div>
        </div>
        <div className="relative">
          <CarouselFadeMask fromColor="from-background" />
          <CarouselContent className="-ml-3 pt-2 pb-3">
            {animes?.map(
              (item, idx) =>
                item && (
                  <CarouselItem key={item?.id ?? idx} className="pl-3 basis-auto">
                    <AnimeCard
                      anime={item as AnimeType}
                      spineIndex={idx}
                    />
                  </CarouselItem>
                )
            )}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
};

export default AnimeContainerCard;
