"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { AnimeInfo } from "@/types/anime.type";
import { MovieInfo, TVInfo } from "@/types/movies.type";
import { usePathname } from "next/navigation";

interface CardBannerProps {
  item: AnimeInfo | MovieInfo | TVInfo;
}

function CardBanner({ item }: CardBannerProps) {
  const pathName = usePathname();
  const fallbackCard = "/fallback-card.webp";
  const [isImageLoading, setImageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640); // Tailwind's mobile breakpoint (sm: 640px)
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAnime = useMemo(() => pathName.split("/")[1] === "anime", [pathName]);

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
        item.coverImage?.large ||
        item.coverImage?.medium ||
        item.coverImage?.color ||
        fallbackCard
      );
    }
    return "poster_path" in item && item.poster_path
      ? item.poster_path
      : fallbackCard;
  }, [item]);

  const genres = useMemo(() => {
    if ("genres" in item) {
      if (item.genres?.length > 0) {
        return typeof item.genres[0] === "string"
          ? (item.genres as string[])
          : (item.genres as { name: string }[]).map((genre) => genre.name);
      }

      const mergedArray = [];
      if ("id_provider" in item) {
        mergedArray.push(...item.tags.slice(0, 2).map((tag) => tag.name));
      }
      if ("imdb_id" in item) {
        const spokenLang = (item as MovieInfo).spoken_languages
          ?.slice(0, 2)
          .map((lang) => lang.english_name);
        const originCountry = (item as MovieInfo).origin_country?.slice(0, 2);
        mergedArray.push(...(spokenLang || []), ...(originCountry || []));
      }
      return mergedArray;
    }
    return [];
  }, [item]);

  const genreSlice = isMobile ? genres.slice(0, 2) : genres.slice(0, 3);

  return (
    <div
      className={`${
        isAnime ? "top-[3.2rem] lg:top-[5.8rem]" : "top-[3rem] lg:top-[5.4rem]"
      } absolute left-5 z-20 flex items-center gap-2 overflow-hidden drop-shadow-lg lg:left-32`}
    >
      <div className="relative h-32 w-24 min-w-24 overflow-hidden md:h-44 md:w-32 lg:h-56 lg:w-40">
        <Image
          unoptimized
          alt={title ?? "Unknown Title"}
          src={imageUrl}
          layout="fill"
          objectFit="cover"
          onLoad={() => setImageLoading(false)}
          className={`
            transition-custom-blur ${
              isImageLoading ? "scale-110 blur-2xl" : "scale-100 blur-0"
            } rounded group-hover:scale-110
          `}
        />
      </div>
      <div
        className={`${
          isAnime ? "top-3 sm:top-2" : "top-4"
        } relative flex flex-col gap-1`}
      >
        <p className="line-clamp-1 max-w-full font-magnatbold text-white sm:text-xl lg:text-2xl">
          {title}
        </p>
        <div className="flex flex-wrap gap-1 text-xs text-white sm:gap-2 sm:text-base">
          {genreSlice.map((genre: string, i: number) => (
            <div
              key={i}
              className="flex items-center truncate rounded bg-gray-400 p-1 text-center font-semibold text-black sm:max-w-full"
            >
              <p>{genre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardBanner;
