"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimeInfo } from "@/types/anime.type";
import { MovieInfo, TVInfo } from "@/types/movies.type";

interface BannerProps {
  item:
    | AnimeInfo
    | Omit<MovieInfo, "genre_names">
    | Omit<TVInfo, "genre_names">;
}

const Banner = ({ item }: BannerProps) => {
  const fallBackBanner = "/fallback-banner.webp";
  const [isImageLoading, setImageLoading] = useState(true);

  // Function to determine the title
  const determineAlt = (): string => {
    if ("title" in item) {
      // For anime or movie
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
      // For TV shows
      return item.name || "Unknown Title";
    }
    return "Unknown Title";
  };

  // Function to get the correct image URL (Anime or Movie)
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
    return fallBackBanner; // Fallback in case there's no image available
  };

  return (
    <div className="relative flex w-full overflow-hidden" key={item.id}>
      <div
        className={`duration-600 ${
          isImageLoading ? "blur-3xl" : "blur-0"
        } absolute inset-0 z-0 transition-all
        ease-in-out`}
      >
        <Image
          unoptimized
          alt={determineAlt()}
          src={getImageUrl()}
          fill
          className="inset-0 h-full w-full object-cover"
          onLoad={() => setImageLoading(false)}
        />
      </div>

      <div className="relative inset-0 z-10 flex w-screen flex-col justify-around gap-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-20 text-white sm:gap-5 md:gap-6 md:p-24 lg:p-32"></div>
    </div>
  );
};

export default Banner;
