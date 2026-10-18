"use client";

import Infos from "./Infos";
import parse from "html-react-parser";
import { FileText, SlidersHorizontal } from "lucide-react";
import { formatDesc, formatDuration, formatDate } from "@/utils/formatted";
import {
  MediaItem,
  getMediaType,
  isAnimeInfo,
  isMovieInfo,
  isTVInfo,
} from "@/utils/mediaTypeChecker";
import fallbackDesc from "@/utils/fallbackDesc.json";

type InfoDetailsProps = {
  item: MediaItem;
};

const InfoDetails: React.FC<InfoDetailsProps> = ({ item }) => {
  const mediaType = getMediaType(item);

  const releaseDate = isMovieInfo(item) ? item.release_date : undefined;

  const startDate =
    isAnimeInfo(item) && item.startIn
      ? formatDate(
          new Date(
            item.startIn.year ?? 0,
            (item.startIn.month ?? 1) - 1,
            item.startIn.day ?? 1
          )
        )
      : isTVInfo(item)
      ? formatDate(item.first_air_date)
      : "unknown";

  const endDate =
    isAnimeInfo(item) && item.endIn
      ? formatDate(
          new Date(
            item.endIn.year ?? 0,
            (item.endIn.month ?? 1) - 1,
            item.endIn.day ?? 1
          )
        )
      : isTVInfo(item)
      ? formatDate(item.last_air_date)
      : "unknown";

  const description = isAnimeInfo(item)
    ? item.description
    : item.overview || fallbackDesc;
  const status = item.status?.replace(/_/g, " ") ?? "unknown";
  const score = isAnimeInfo(item)
    ? item.score?.decimalScore
    : item.vote_average ?? "unknown";
  const format = isAnimeInfo(item) ? item.format : mediaType;
  const duration = isAnimeInfo(item)
    ? item.duration
    : isMovieInfo(item)
    ? item.runtime
    : 0;
  const episodes = isAnimeInfo(item)
    ? `${item.episodes ? `${item.episodes} Episodes` : "Unknown"}`
    : isTVInfo(item)
    ? `${item.number_of_episodes} Episodes`
    : "unknown";
  const season = isAnimeInfo(item)
    ? item.season
    : isTVInfo(item)
    ? `${item.number_of_seasons} Seasons`
    : "?";
  const studios = isAnimeInfo(item)
    ? item.studios[0]?.name
    : item.production_companies[0]?.name ?? "unknown";

  const cleanSynopsis = formatDesc(description);

  return (
    <section
      aria-label="Edition technical specifications and liner notes"
      className="my-6 grid grid-cols-1 gap-6 rounded-sm border border-hairline bg-surface-1 p-5 sm:p-7 lg:grid-cols-12"
    >
      {/* Left Column: Technical Specifications (5 cols) */}
      <div className="flex flex-col lg:col-span-5 lg:border-r lg:border-hairline lg:pr-7">
        <h2 className="mb-3 flex items-center gap-2 border-b border-hairline pb-2.5 font-display text-base font-bold tracking-tight text-foreground">
          <SlidersHorizontal className="size-4 text-gold" strokeWidth={1.75} />
          <span>Edition Specifications</span>
        </h2>

        <div className="flex flex-col">
          <Infos
            topic="Average Score"
            value={`${score} / 10`}
            customTheme="text-gold font-bold"
          />
          <Infos topic="Status" value={status} />
          <Infos topic="Format" value={format?.toUpperCase()} />
          {releaseDate?.length && (
            <Infos topic="Release Date" value={formatDate(releaseDate)} />
          )}
          {(mediaType === "movie" || mediaType === "anime") && (
            <Infos
              topic={
                mediaType === "movie" ? "Duration" : "Average Episode Duration"
              }
              value={formatDuration(duration) || "unknown"}
            />
          )}
          {mediaType !== "movie" && (
            <>
              <Infos topic="Total Episode" value={episodes} />
              <Infos topic="Start Date" value={startDate} />
              <Infos topic="End Date" value={endDate} />
              <Infos topic="Season" value={season} />
            </>
          )}
          {isAnimeInfo(item) && item.title.native && (
            <Infos topic="Native" value={item.title.native} />
          )}
          {isAnimeInfo(item) && item.title.romaji && (
            <Infos topic="Romanji" value={item.title.romaji} />
          )}
          <Infos
            topic="Studio"
            value={studios}
            customTheme="text-vermilion font-bold"
          />
        </div>
      </div>

      {/* Right Column: Liner Notes / Synopsis (7 cols) */}
      <div className="flex flex-col lg:col-span-7 lg:pl-2">
        <h2 className="mb-3 flex items-center gap-2 border-b border-hairline pb-2.5 font-display text-base font-bold tracking-tight text-foreground">
          <FileText className="size-4 text-gold" strokeWidth={1.75} />
          <span>Synopsis &amp; Liner Notes</span>
        </h2>
        <p className="max-w-[68ch] text-pretty text-sm leading-relaxed text-foreground/90 sm:text-base">
          {parse(cleanSynopsis ?? "unknown")}
        </p>
      </div>
    </section>
  );
};

export default InfoDetails;
