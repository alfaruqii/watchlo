"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, ExternalLink, Clapperboard, Award } from "lucide-react";
import { MediaStudioItem, MediaStaffItem, RelationOrRecommendation } from "@/types/anime.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselFadeMask,
} from "@/components/ui/carousel";

export interface ProductionWorkItem extends RelationOrRecommendation {
  productionRole?: string;
}

interface AnimeProductionRackProps {
  studios?: MediaStudioItem[];
  leadDirector?: MediaStaffItem | null;
  productionWorks?: ProductionWorkItem[];
  currentAnimeTitle?: string;
}

export default function AnimeProductionRack({
  studios = [],
  leadDirector,
  productionWorks = [],
  currentAnimeTitle = "",
}: AnimeProductionRackProps) {
  const mainStudio = studios.find((s) => s.isMain) || studios.find((s) => s.isAnimationStudio) || studios[0];
  const partnerStudios = studios.filter((s) => s.id !== mainStudio?.id);

  if (!mainStudio && !leadDirector && productionWorks.length === 0) {
    return null;
  }

  const directorName =
    leadDirector?.name?.userPreferred || leadDirector?.name?.full || leadDirector?.name?.native;

  return (
    <section
      aria-label="Production Studio & Creative Ledger"
      className="my-6 rounded-sm border border-hairline bg-surface-1 p-4 sm:p-6"
    >
      {/* 1. Header: Production Ledger Metadata */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-xs border border-gold/40 bg-gold/10 text-gold">
            <Building2 className="size-4" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg">
              Production Studio &amp; Creative Ledger
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-wider text-gold sm:text-[10px]">
              Studio Lineage &amp; Creative Personnel Archives
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className="border-gold/30 font-mono text-[9px] uppercase tracking-wider text-gold sm:text-[10px]"
        >
          PRODUCTION ARCHIVE
        </Badge>
      </div>

      {/* 2. Studio Identity Dossier */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Main Animation Studio Card */}
        {mainStudio && (
          <div className="flex flex-col justify-between rounded-sm border border-gold/30 bg-surface-2/60 p-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-wider text-gold font-bold">
                  Lead Animation Studio
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">#ST-{mainStudio.id}</span>
              </div>
              <p className="font-display text-base font-bold text-foreground sm:text-lg">
                {mainStudio.name}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                {mainStudio.isAnimationStudio
                  ? "Primary Animation Production & Key Animation Unit"
                  : "Production Lead"}
              </p>
            </div>
            {mainStudio.siteUrl && (
              <div className="mt-3 border-t border-hairline/60 pt-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-mono text-[10px] text-gold hover:bg-transparent hover:text-amber-300"
                >
                  <a
                    href={mainStudio.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <span>AniList Studio Ledger</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Lead Director / Head Creator Card */}
        {leadDirector && (
          <div className="flex flex-col justify-between rounded-sm border border-hairline bg-surface-2/40 p-3">
            <div className="flex items-start gap-3">
              {leadDirector.image?.large ? (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xs border border-hairline bg-surface-1">
                  <Image
                    unoptimized
                    src={leadDirector.image.large}
                    alt={directorName || "Director"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xs border border-hairline bg-surface-1 text-gold">
                  <Clapperboard className="size-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-gold font-bold">
                  {leadDirector.role || "Series Director"}
                </span>
                <p className="truncate font-display text-sm font-bold text-foreground sm:text-base">
                  {directorName}
                </p>
                {leadDirector.name?.native && (
                  <p className="truncate font-sans text-[10px] text-muted-foreground">
                    {leadDirector.name.native}
                  </p>
                )}
              </div>
            </div>
            {leadDirector.siteUrl && (
              <div className="mt-3 border-t border-hairline/60 pt-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-mono text-[10px] text-gold hover:bg-transparent hover:text-amber-300"
                >
                  <a
                    href={leadDirector.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <span>Creator Personnel Dossier</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Production Partners & Committee */}
        {partnerStudios.length > 0 && (
          <div className="flex flex-col justify-between rounded-sm border border-hairline bg-surface-2/30 p-3 sm:col-span-2 lg:col-span-1">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                Production Committee &amp; Partners ({partnerStudios.length})
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                {partnerStudios.map((partner) => (
                  <Badge
                    key={partner.id}
                    variant="outline"
                    className="border-hairline bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                  >
                    {partner.name}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="mt-2 font-mono text-[9px] text-muted-foreground">
              Producers, broadcasters &amp; publishing partners
            </p>
          </div>
        )}
      </div>

      {/* 3. Works by the Same Creative Production Team */}
      {productionWorks.length > 0 && (
        <div className="mt-6 border-t border-hairline pt-4">
          <Carousel className="w-full">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <Award className="size-3.5 text-gold shrink-0" />
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground sm:text-sm">
                    {leadDirector
                      ? `Works from the Same Production Team (Directed by ${directorName})`
                      : currentAnimeTitle
                      ? `Works from the Same Production Unit as ${currentAnimeTitle}`
                      : "Works from Same Production Unit"}
                  </h3>
                  <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
                    ({productionWorks.length} Titles)
                  </span>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">
                  Other catalog works helmed or credited to this creative director &amp; production unit
                </span>
              </div>
              <CarouselNavigation />
            </div>

            <div className="relative">
              <CarouselFadeMask fromColor="from-surface-1" />
              <CarouselContent className="-ml-3 py-1">
                {productionWorks.map((work) => {
                  const title =
                    typeof work.title === "object"
                      ? work.title.userPreferred ||
                        work.title.romaji ||
                        work.title.english ||
                        work.title.native
                      : work.title;

                  const poster =
                    work.coverImage?.large ||
                    work.coverImage?.medium ||
                    "/poster-placeholder.png";

                  return (
                    <CarouselItem
                      key={work.id}
                      className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                    >
                      <Link
                        href={`/anime/detail/${work.id}`}
                        className="group flex flex-col overflow-hidden rounded-sm border border-hairline bg-surface-2 transition-all duration-200 hover:-translate-y-1 hover:border-gold/50"
                      >
                        {/* Poster Image */}
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-3">
                          <Image
                            unoptimized
                            src={poster}
                            alt={title || "Anime Title"}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface-0/90 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                          {/* Score Badge */}
                          {work.averageScore && (
                            <div className="absolute top-1.5 right-1.5 rounded-2xs border border-hairline bg-surface-0/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gold">
                              ★ {work.averageScore}%
                            </div>
                          )}

                          {/* Format Tag */}
                          <div className="absolute bottom-1.5 left-1.5 rounded-2xs border border-hairline/80 bg-surface-0/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                            {work.format || "TV"}
                          </div>
                        </div>

                        {/* Title and Role */}
                        <div className="flex flex-col p-2">
                          <h4
                            className="line-clamp-1 font-display text-xs font-semibold text-foreground group-hover:text-gold"
                            title={title}
                          >
                            {title}
                          </h4>
                          <span
                            className="mt-1 line-clamp-1 font-mono text-[10px] text-gold"
                            title={work.productionRole || "Production"}
                          >
                            {work.productionRole || "Production"}
                          </span>
                        </div>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </div>
          </Carousel>
        </div>
      )}
    </section>
  );
}
