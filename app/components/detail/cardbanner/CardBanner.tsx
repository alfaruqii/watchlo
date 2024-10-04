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
      return item.coverImage.large || item.coverImage.medium || '';
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
      <div className="absolute flex items-center gap-2 z-20 overflow-hidden top-24 drop-shadow-lg left-3 lg:left-32 lg:top-[8.5rem]">
        <div className="relative overflow-hidden">
          <Image
            alt={determineTitle()}
            src={getImageUrl()}
            width={1000}
            height={1000}
            onLoad={() => setImageLoading(false)}
            className={`
                transition-custom-blur
                ${isImageLoading
                ? 'scale-110 blur-2xl'
                : 'scale-100 blur-0 group-hover:scale-110'
              } object-cover w-24 lg:w-40 rounded`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-white font-magnatbold max-w-full sm:text-xl lg:text-2xl line-clamp-1">
            {determineTitle()}
          </p>
          <div className="flex gap-1 sm:gap-3 text-xs sm:text-base text-white">
            {getGenres().slice(0, 3).map((genre: string, i: number) => (
              <span key={i} className="bg-gray-400/60 flex items-center max-w-20 sm:max-w-full text-center p-1 rounded">
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

