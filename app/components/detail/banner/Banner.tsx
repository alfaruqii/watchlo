"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimeInfo } from "@/types/anime.type";
import { MovieInfo, TVInfo } from "@/types/movies.type";
import { MangaItem, MangaDetailInfo } from "@/types/manga.type";

interface BannerProps {
  item:
    | AnimeInfo
    | Omit<MovieInfo, "genre_names">
    | Omit<TVInfo, "genre_names">
    | MangaItem
    | MangaDetailInfo;
}

const Banner = ({ item }: BannerProps) => {
  const fallBackBanner = "/fallback-banner.webp";
  const [isImageLoading, setImageLoading] = useState(true);

  const determineAlt = (): string => {
    if ("title" in item) {
      if (typeof item.title === "object") {
        return (
          item.title.userPreferred ||
          item.title.english ||
          item.title.romaji ||
          item.title.native ||
          "Unknown Title"
        );
      }
      return item.title || "Unknown Title";
    } else if ("name" in item) {
      return item.name || "Unknown Title";
    }
    return "Unknown Title";
  };

  const getImageUrl = (): string => {
    if ("bannerImage" in item && item.bannerImage) {
      return item.bannerImage;
    }
    if ("coverImage" in item && item.coverImage) {
      return (
        item.coverImage.large ||
        item.coverImage.medium ||
        item.coverImage.color ||
        fallBackBanner
      );
    }
    if ("backdrop_path" in item && item.backdrop_path) {
      return item.backdrop_path;
    }
    return fallBackBanner;
  };

  return (
    <div
      className="obi-frame-corners relative flex h-52 w-full overflow-hidden border-b border-hairline bg-surface-1 sm:h-64 lg:h-80"
      key={item.id}
    >
      <div
        className={`absolute inset-0 z-0 transition-all duration-700 ease-out ${
          isImageLoading ? "scale-105 blur-2xl" : "scale-100 blur-0"
        }`}
      >
        <Image
          unoptimized
          alt={determineAlt()}
          src={getImageUrl()}
          fill
          priority
          className="inset-0 h-full w-full object-cover"
          onLoad={() => setImageLoading(false)}
        />
      </div>

      {/* Warm Obsidian & Surface Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/65 to-[#0d0c0a]/30"
      />

      <div className="relative z-20 flex w-full items-start justify-end px-4 py-3 sm:mt-auto sm:items-center sm:px-6 lg:px-10">
        <span className="rounded-sm border border-hairline bg-background/95 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground tabular-nums sm:px-2.5 sm:py-1 sm:text-[11px]">
          DOSSIER // CAT #{item.id}
        </span>
      </div>
    </div>
  );
};

export default Banner;
