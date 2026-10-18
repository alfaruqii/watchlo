"use client";

import { BookOpen } from "lucide-react";
import MangaCard from "./MangaCard";
import { MangaItem } from "@/types/manga.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselFadeMask,
} from "@/components/ui/carousel";

interface MangaContainerProps {
  mangas: MangaItem[];
  containerTitle: string;
  subtitle?: string;
}

export default function MangaContainerCard({
  mangas,
  containerTitle,
  subtitle,
}: MangaContainerProps) {
  if (!mangas || mangas.length === 0) return null;

  return (
    <section className="overflow-hidden pt-6 pb-2 sm:px-6 lg:px-10">
      <Carousel className="w-full">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-hairline pb-2.5">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
            <div>
              <h2 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
                {containerTitle}
              </h2>
              {subtitle && (
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums sm:text-[11px]">
              {mangas.length} EDITIONS
            </span>
            <CarouselNavigation />
          </div>
        </div>
        <div className="relative">
          <CarouselFadeMask fromColor="from-background" />
          <CarouselContent className="-ml-3 pt-2 pb-3">
            {mangas.map((item, idx) => (
              <CarouselItem key={item.id ?? idx} className="pl-3 basis-auto">
                <MangaCard manga={item} spineIndex={idx} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
}
