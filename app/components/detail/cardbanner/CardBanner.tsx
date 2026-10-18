"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { AnimeInfo } from "@/types/anime.type";
import { MovieInfo, TVInfo } from "@/types/movies.type";
import { MangaItem, MangaDetailInfo } from "@/types/manga.type";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CardBannerProps {
  item: AnimeInfo | MovieInfo | TVInfo | MangaItem | MangaDetailInfo;
}

function CardBanner({ item }: CardBannerProps) {
  const fallbackCard = "/fallback-card.webp";
  const [isImageLoading, setImageLoading] = useState(true);

  const targetBaseUrl = useMemo(() => {
    if ("format" in item && (item.format === "MANGA" || item.format === "NOVEL" || item.format === "ONE_SHOT")) {
      return "/manga";
    }
    if ("subtype" in item) {
      return "/manga";
    }
    if ("studios" in item || "id_provider" in item) {
      return "/anime";
    }
    return "/";
  }, [item]);

  const title = useMemo(() => {
    if ("title" in item) {
      if (typeof item.title === "object") {
        return (
          item.title?.userPreferred ||
          item.title?.english ||
          item.title?.romaji ||
          item.title?.native
        );
      }
      return item.title;
    }
    return "name" in item ? item.name : "Unknown Title";
  }, [item]);

  const imageUrl = useMemo(() => {
    if ("coverImage" in item && item.coverImage) {
      return (
        item.coverImage?.extraLarge ||
        item.coverImage?.large ||
        item.coverImage?.medium ||
        fallbackCard
      );
    }
    return "poster_path" in item && item.poster_path
      ? item.poster_path
      : fallbackCard;
  }, [item]);

  const genres = useMemo(() => {
    if ("genres" in item && Array.isArray(item.genres) && item.genres.length > 0) {
      return typeof item.genres[0] === "string"
        ? (item.genres as string[])
        : (item.genres as { name: string }[]).map((genre) => genre.name);
    }

    const mergedArray: string[] = [];
    if ("tags" in item && Array.isArray((item as AnimeInfo).tags)) {
      mergedArray.push(...(item as AnimeInfo).tags.slice(0, 2).map((tag) => tag.name));
    }
    if ("imdb_id" in item) {
      const spokenLang = (item as MovieInfo).spoken_languages
        ?.slice(0, 2)
        .map((lang) => lang.english_name);
      const originCountry = (item as MovieInfo).origin_country?.slice(0, 2);
      mergedArray.push(...(spokenLang || []), ...(originCountry || []));
    }
    return mergedArray;
  }, [item]);

  return (
    <div className="relative z-20 -mt-16 mb-6 flex flex-row items-end gap-3.5 sm:-mt-28 sm:gap-6">
      {/* Collector Sleeve Poster Plate */}
      <div className="w-fit shrink-0 rounded-sm border border-hairline bg-surface-1 p-1.5 shadow-sleeve sm:p-2">
        <div className="mb-1 flex items-center justify-between gap-1 border-b border-hairline pb-1 font-mono text-[9px] uppercase tracking-wider text-gold tabular-nums sm:mb-1.5 sm:text-[10px]">
          <span className="truncate">SPINE #{item.id}</span>
          <span className="shrink-0 text-muted-foreground">ED.</span>
        </div>
        <div className="relative h-36 w-24 overflow-hidden rounded-sm bg-surface-2 sm:h-48 sm:w-36 lg:h-56 lg:w-40">
          <Image
            unoptimized
            alt={title ?? "Unknown Title"}
            src={imageUrl}
            fill
            sizes="(max-width: 640px) 96px, 160px"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            className={`object-cover transition-custom-blur ${
              isImageLoading ? "scale-110 blur-2xl" : "scale-100 blur-0"
            }`}
          />
        </div>
      </div>

      {/* Heading-first Dossier Title & OBI Genre Strip */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-0.5 sm:gap-2.5 sm:pb-1">
        <h1 className="line-clamp-3 text-balance font-display text-lg font-extrabold leading-tight tracking-tight text-foreground sm:line-clamp-none sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {Boolean(
            ("isAdult" in item && item.isAdult) ||
              genres.some((g) => g.toLowerCase() === "hentai")
          ) && (
            <Badge
              variant="outline"
              className="border-vermilion/60 bg-vermilion/15 font-mono text-[10px] font-bold tracking-wider text-vermilion sm:text-xs"
            >
              18+ ADULT
            </Badge>
          )}
          {genres.slice(0, 4).map((genre: string, i: number) => (
            <Link
              key={i}
              href={`${targetBaseUrl}?genre=${encodeURIComponent(genre)}`}
              className="inline-block"
            >
              <Badge
                variant="secondary"
                className="text-[10px] transition-colors hover:border-gold/40 hover:bg-gold/15 hover:text-gold sm:text-xs cursor-pointer"
              >
                {genre}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardBanner;
