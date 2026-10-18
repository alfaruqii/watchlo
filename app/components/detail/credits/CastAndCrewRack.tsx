"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, Clapperboard, Award, UserCheck, ShieldCheck } from "lucide-react";
import { TMDBCastMember, TMDBCrewMember } from "@/types/movies.type";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselFadeMask,
} from "@/components/ui/carousel";

interface CastAndCrewRackProps {
  cast: TMDBCastMember[];
  crew?: TMDBCrewMember[];
  title?: string;
}

export default function CastAndCrewRack({
  cast = [],
  crew = [],
  title = "Principal Cast & Production Personnel",
}: CastAndCrewRackProps) {
  const [activeTab, setActiveTab] = useState<"cast" | "crew">("cast");

  if (!cast.length && !crew.length) {
    return null;
  }

  // Filter significant crew roles to avoid hundreds of duplicates
  const priorityDepartments = ["Directing", "Writing", "Production", "Sound", "Camera", "Editing"];
  const significantCrew = crew
    .filter((member) =>
      priorityDepartments.includes(member.department) ||
      ["Director", "Screenplay", "Writer", "Producer", "Original Music Composer", "Director of Photography"].includes(
        member.job
      )
    )
    .reduce<TMDBCrewMember[]>((acc, current) => {
      const exists = acc.find((item) => item.id === current.id && item.job === current.job);
      if (!exists) acc.push(current);
      return acc;
    }, [])
    .slice(0, 24);

  const displayCast = cast.slice(0, 28);

  return (
    <section
      aria-label="Cast and production credits shelf"
      className="my-6 rounded-sm border border-hairline bg-surface-1 p-3.5 sm:p-6"
    >
      {/* 1. Header Bar: Title, Icon & Archival Badge */}
      <div className="flex items-start justify-between gap-2.5 border-b border-hairline pb-3 sm:items-center">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xs border border-hairline bg-surface-2 text-gold">
            <Clapperboard className="size-4" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg">
              {title}
            </h2>
            <span className="font-mono text-[9px] tracking-wider uppercase text-gold sm:text-[10px]">
              Theatrical Cast &amp; Crew Ledger
            </span>
          </div>
        </div>

        <Badge variant="outline" className="shrink-0 border-gold/30 font-mono text-[9px] uppercase tracking-wider text-gold sm:text-[10px]">
          TMDB ARCHIVE
        </Badge>
      </div>

      {/* 2. Control Strip: Tab switchers */}
      <div className="my-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-sm border border-hairline bg-surface-2 p-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("cast")}
            className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xs px-2.5 py-1.5 font-mono text-xs transition-colors cursor-pointer sm:px-3 ${
              activeTab === "cast"
                ? "bg-surface-1 text-gold font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5 shrink-0" />
            <span><span className="hidden sm:inline">Principal </span>Cast ({displayCast.length})</span>
          </button>
          {significantCrew.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("crew")}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xs px-2.5 py-1.5 font-mono text-xs transition-colors cursor-pointer sm:px-3 ${
                activeTab === "crew"
                  ? "bg-surface-1 text-gold font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award className="size-3.5 shrink-0" />
              <span><span className="hidden sm:inline">Production </span>Crew ({significantCrew.length})</span>
          </button>
        )}
      </div>
    </div>

      {/* Cast Tab Content */}
      {activeTab === "cast" && (
        <Carousel className="w-full">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              {displayCast.length} Theatrical Performers // Drag or navigate
            </span>
            <CarouselNavigation />
          </div>
          <div className="relative">
            <CarouselFadeMask fromColor="from-surface-1" />
            <CarouselContent className="-ml-3 py-1">
              {displayCast.map((actor, idx) => {
                const hasPhoto = Boolean(actor.profile_path);
                return (
                  <CarouselItem key={`${actor.id}-${actor.cast_id || idx}`} className="pl-3 basis-auto">
                    <div className="group flex w-[124px] shrink-0 flex-col rounded-sm border border-hairline bg-surface-2 p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 sm:w-[138px]">
                      {/* Index & Department Micro-tag */}
                      <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                        <span className="text-gold">#{String(idx + 1).padStart(2, "0")}</span>
                        <span className="truncate uppercase">{actor.order === 0 ? "LEAD" : "CAST"}</span>
                      </div>

                      {/* Actor Portrait */}
                      <div className="relative mb-2 aspect-[2/3] w-full overflow-hidden rounded-xs border border-hairline/60 bg-surface-1">
                        {hasPhoto ? (
                          <Image
                            unoptimized
                            src={actor.profile_path!}
                            alt={actor.name}
                            fill
                            sizes="138px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center text-muted-foreground">
                            <UserCheck className="size-6 text-hairline" />
                            <span className="font-mono text-[9px] tracking-wider uppercase">Archival File</span>
                          </div>
                        )}
                      </div>

                      {/* Names */}
                      <div className="flex flex-col">
                        <span className="line-clamp-1 text-xs font-semibold text-foreground group-hover:text-gold">
                          {actor.name}
                        </span>
                        <span className="line-clamp-1 text-[11px] text-muted-foreground" title={actor.character}>
                          as {actor.character || "Self"}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </div>
        </Carousel>
      )}

      {/* Crew Tab Content */}
      {activeTab === "crew" && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {significantCrew.map((member, idx) => {
            const hasPhoto = Boolean(member.profile_path);
            return (
              <div
                key={`${member.id}-${member.credit_id || idx}`}
                className="flex items-center gap-2.5 rounded-sm border border-hairline bg-surface-2 p-2 transition-colors hover:border-gold/30"
              >
                <div className="relative size-11 shrink-0 overflow-hidden rounded-xs border border-hairline bg-surface-1">
                  {hasPhoto ? (
                    <Image
                      unoptimized
                      src={member.profile_path!}
                      alt={member.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShieldCheck className="size-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {member.name}
                  </span>
                  <span className="truncate font-mono text-[10px] text-gold">
                    {member.job}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    Dept: {member.department}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
