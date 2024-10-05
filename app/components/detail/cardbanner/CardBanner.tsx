"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimeInfo } from "@/types/anime.type";
import { MovieInfo, TVInfo } from "@/types/movies.type";

interface CardBannerProps {
  item: AnimeInfo | MovieInfo | TVInfo;
}

function CardBanner({ item }: CardBannerProps) {
  const [isImageLoading, setImageLoading] = useState(true);
  // Function to determine the title
  const determineTitle = (): string => {
    if ('title' in item) {
      if (typeof item.title === 'object') {
        return item.title.userPreferred || item.title.english || item.title.romaji || item.title.native || 'Unknown Title';
      }
      return item.title || "Unknown Title";
    }
    if ('name' in item) {
      return item.name;
    }
    return 'Unknown Title';
  };

  // Function to get the correct image URL (Anime or Movie)
  const getImageUrl = (): string => {
    if ('coverImage' in item && item.coverImage) {
      return item.coverImage.large || item.coverImage.medium;
    }
    if ('poster_path' in item && item.backdrop_path) {
      return item.poster_path;
    }
    return '/fallback-card.webp'; // Fallback in case there's no image available
  };

  // Function to get genres (handling both AnimeInfo and MovieInfo)
  const getGenres = (): string[] => {
    if ('genres' in item) {
      // For AnimeInfo, genres are an array of strings
      if (typeof item.genres[0] === 'string') {
        return item.genres as string[];
      }

      // For MovieInfo, genres are an array of objects
      if (typeof item.genres[0] === 'object' && item.genres[0]["name"]) {
        return (item as MovieInfo).genres.map((genre) => genre.name);
      }
    }
    return [];
  };

  return (
    <>
      <div className="absolute left-3 top-[6.5rem] z-20 flex items-center gap-2 overflow-hidden drop-shadow-lg lg:left-32 lg:top-[8.5rem]">
        <div className="relative overflow-hidden">
          <Image
            unoptimized
            alt={determineTitle()}
            src={getImageUrl()}
            width={1000}
            height={1000}
            onLoad={() => setImageLoading(false)}
            className={`
                transition-custom-blur
                ${isImageLoading
                ? 'scale-110 blur-2xl'
                : 'scale-100 group-hover:scale-110'}
              min-h-32 w-24 rounded object-cover blur-0 lg:w-40`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="line-clamp-1 max-w-full font-magnatbold text-white sm:text-xl lg:text-2xl">
            {determineTitle()}
          </p>
          <div className="flex gap-1 text-xs text-white sm:gap-3 sm:text-base">
            {getGenres().slice(0, 3).map((genre: string, i: number) => (
              <span key={i} className="flex max-w-20 items-center rounded bg-gray-400/60 p-1 text-center sm:max-w-full">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardBanner;

