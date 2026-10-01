"use client";
import { useState } from "react";
import Image from "next/image";
import { Layers } from "lucide-react";
import RatingComponent from "../rating/RatingComponent";
import ButtonWatch from "./ButtonWatch";
import { formatDesc } from "@/utils/formatted";
import fallbackDesc from "@/utils/fallbackDesc.json";
import { Seasons, TVInfo } from "@/types/movies.type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function SeasonComponent({ data }: { data: TVInfo }) {
  const [isImageLoading, setImageLoading] = useState(true);
  const now = Date.now();

  const alreadyReleased = (season: Seasons): boolean => {
    return !!(season.air_date && new Date(season.air_date).getTime() < now);
  };

  const doesNameSameLikeSeason = (season: Seasons): boolean => {
    return `season ${season.season_number}` === season.name?.toLowerCase();
  };

  const filteredSeason = data.seasons.filter((season: Seasons) => {
    return (
      season.season_number !== 0 &&
      season.episode_count > 0 &&
      Boolean(season.air_date && new Date(season.air_date).getTime() < now)
    );
  });

  return (
    <section className="flex flex-col overflow-hidden rounded-sm border border-hairline bg-surface-1 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-hairline pb-2.5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
          <Layers className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
          <span>Season Volumes</span>
        </h2>
        <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums sm:text-[11px]">
          {filteredSeason.length} VOLUMES
        </span>
      </div>

      <div className="max-h-[24rem] overflow-y-auto pr-1">
        <Accordion
          type="single"
          collapsible
          defaultValue={
            filteredSeason[0]
              ? `season-${filteredSeason[0].season_number}`
              : undefined
          }
        >
          {filteredSeason.map((season) => (
            <AccordionItem
              className="mb-2 overflow-hidden rounded-sm border border-hairline bg-surface-2 last:mb-0"
              key={season.season_number}
              value={`season-${season.season_number}`}
            >
              <div className="relative">
                <div className="absolute inset-0 z-0 h-full w-full">
                  <Image
                    unoptimized
                    src={
                      (season.poster_path && season.poster_path.trim()) ||
                      (data.poster_path && data.poster_path.trim()) ||
                      "/fallback-card.webp"
                    }
                    alt={data.name}
                    fill
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    className={`object-cover transition-custom-blur ${
                      isImageLoading
                        ? "scale-110 blur-2xl"
                        : "scale-100 blur-0"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0a]/90 via-[#0d0c0a]/80 to-[#0d0c0a]/65" />
                </div>
                <AccordionTrigger className="relative z-10 px-4 py-3 font-display text-base font-bold text-[#f2ece1] hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <span className="font-mono text-xs text-[#e09f3e] tabular-nums">
                      VOL. #{String(season.season_number).padStart(2, "0")}
                    </span>
                    <div>
                      <span>Season {season.season_number}</span>
                      {season.name && (
                        <p
                          className={`${
                            doesNameSameLikeSeason(season)
                              ? "hidden"
                              : "line-clamp-1 font-sans text-xs font-normal text-[#f2ece1]/75"
                          }`}
                        >
                          ({season.name})
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="relative z-10 border-t border-[#f2ece1]/15 px-4 pb-4 pt-3 text-[#f2ece1]">
                  <div className="flex flex-col gap-3">
                    <p className="line-clamp-2 max-w-[65ch] text-sm text-[#f2ece1]/85">
                      {formatDesc(
                        season.overview || data.overview || fallbackDesc
                      )}
                    </p>
                    {alreadyReleased(season) ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <RatingComponent score={season.vote_average} />
                        <ButtonWatch
                          text="Watch"
                          season={season.season_number}
                          ep={1}
                          id={data.id}
                        />
                      </div>
                    ) : (
                      <ButtonWatch text="Not Yet Released" />
                    )}
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default SeasonComponent;
