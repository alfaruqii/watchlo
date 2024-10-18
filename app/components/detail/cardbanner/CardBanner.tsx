"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { AnimeInfo } from "@/types/anime.type";
import { MovieInfo, TVInfo } from "@/types/movies.type";
import { usePathname } from "next/navigation";

interface CardBannerProps {
  item: AnimeInfo | MovieInfo | TVInfo;
}

function CardBanner({ item }: CardBannerProps) {
  const pathName = usePathname();
  const [isImageLoading, setImageLoading] = useState(true);

  const isAnime = useMemo(() => pathName.split('/')[1] === "anime", [pathName]);

  const title = useMemo(() => {
    if ('title' in item) {
      if (typeof item.title === 'object') {
        return item.title.userPreferred || item.title.english || item.title.romaji || item.title.native || 'Unknown Title';
      }
      return item.title || "Unknown Title";
    }
    return ('name' in item) ? item.name : 'Unknown Title';
  }, [item]);

  const imageUrl = useMemo(() => {
    if ('coverImage' in item && item.coverImage) {
      return item.coverImage.large || item.coverImage.medium || item.coverImage.color;
    }
    return ('poster_path' in item && item.poster_path) ? item.poster_path : '/fallback-card.webp';
  }, [item]);

  const genres = useMemo(() => {
    if ('genres' in item) {
      if (item.genres.length > 0) {
        return typeof item.genres[0] === 'string'
          ? item.genres as string[]
          : (item.genres as { name: string }[]).map(genre => genre.name);
      }

      const mergedArray = [];
      if ("id_provider" in item) {
        mergedArray.push(...item.tags.slice(0, 2).map(tag => tag.name));
      }
      if ("imdb_id" in item) {
        const spokenLang = (item as MovieInfo).spoken_languages?.slice(0, 2).map(lang => lang.english_name);
        const originCountry = (item as MovieInfo).origin_country?.slice(0, 2);
        mergedArray.push(...(spokenLang || []), ...(originCountry || []));
      }
      return mergedArray;
    }
    return [];
  }, [item]);

  return (
    <div className={`absolute left-5 ${isAnime ? "top-[3.2rem] lg:top-[5.8rem]" : "top-[3rem] lg:top-[5.4rem]"} z-20 flex items-center gap-2 overflow-hidden drop-shadow-lg lg:left-32`}>
      <div className="relative w-24 h-32 min-w-24 md:w-32 md:h-44 lg:w-40 lg:h-56 overflow-hidden">
        <Image
          unoptimized
          alt={title}
          src={imageUrl}
          layout="fill"
          objectFit="cover"
          onLoad={() => setImageLoading(false)}
          className={`
            transition-custom-blur rounded
            ${isImageLoading
              ? 'scale-110 blur-2xl'
              : 'scale-100 group-hover:scale-110 blur-0'}
          `}
        />
      </div>
      <div className={`flex flex-col relative gap-1 ${isAnime ? "top-3 sm:top-2" : "top-4"}`}>
        <p className="line-clamp-1 max-w-full font-magnatbold text-white sm:text-xl lg:text-2xl">
          {title}
        </p>
        <div className="flex flex-wrap gap-1 text-xs text-white sm:gap-2 sm:text-base">
          {genres.slice(0, 3).map((genre: string, i: number) => (
            <div key={i} className="flex items-center rounded truncate font-semibold text-black bg-gray-400 p-1 text-center sm:max-w-full">
              <p>{genre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardBanner;
