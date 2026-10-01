"use client";

import { Film } from "lucide-react";
import { MoviesCard } from "./MoviesCard";
import { MovieInfo, TVInfo } from "@/types/movies.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselFadeMask,
} from "@/components/ui/carousel";

interface MoviesContainerProps {
  movies: MovieInfo[] | TVInfo[];
  containerTitle: string;
  isDetail?: boolean;
  season?: number;
  ep?: number;
}

export const MoviesContainerCard = ({
  movies,
  containerTitle,
  isDetail = true,
  season,
  ep,
}: MoviesContainerProps) => {
  return (
    <section className="overflow-hidden pt-6 pb-2 sm:px-6 lg:px-10">
      <Carousel className="w-full">
        {containerTitle && (
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-hairline pb-2.5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
              <Film className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
              <span>{containerTitle}</span>
            </h2>
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums sm:text-[11px]">
                {movies?.length ?? 0} EDITIONS
              </span>
              <CarouselNavigation />
            </div>
          </div>
        )}
        <div className="relative">
          <CarouselFadeMask fromColor="from-background" />
          <CarouselContent className="-ml-3 pt-2 pb-3">
            {movies.map((item, i) => (
              <CarouselItem key={item.id ?? i} className="pl-3 basis-auto">
                <MoviesCard
                  movie={item}
                  spineIndex={i}
                  isDetail={isDetail}
                  season={season}
                  ep={ep}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
};
