"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import parse from 'html-react-parser';
import Genre from "@/components/genre/Genre";
import { Title, CoverImage } from "@/types/anime.type";
import { usePathname } from "next/navigation";

type MediaProps = {
  id: number;
  title: string | Title;
  description: string;
  genres?: string[];
  bannerImage?: string;
  coverImage: string | CoverImage;
};

function HeroMedia({ id, title, description, bannerImage, coverImage, genres }: MediaProps) {
  const [isImageLoading, setImageLoading] = useState(true);
  const pathName = usePathname();
  const pathType = pathName.split('/')[1]; // This gives you either 'movie' or 'tv'
  const cleanDesc = description?.replace(/<br\s*\/?>/gi, '');

  const displayTitle = typeof title === "string" ? title : title.userPreferred;
  const displayCoverImage = typeof coverImage === "string" ? coverImage : coverImage.extraLarge;

  const determineNavigateTo = (): string => {
    if (pathType.toLowerCase() === "anime") return `/anime/detail/${id}`;
    // NOTE: the hero is only provide the Movie data not the Series
    if (pathType.toLowerCase() === "series") return `/series/detail/${id}`;
    return `/movie/detail/${id}`
  }

  return (
    <div className="embla__slide relative flex w-full" key={id}>
      {(bannerImage || displayCoverImage) && (
        <Image
          unoptimized
          alt={displayTitle}
          src={bannerImage ?? displayCoverImage ?? '/fallback-banner.webp'} // Add fallback image
          fill
          onLoad={() => setImageLoading(false)}
          className={`inset-0 transition-all duration-700 ease-in-out z-0 h-full w-full object-cover ${isImageLoading ? "blur-3xl" : "blur-0"}`}
        />

      )}
      <div className="inset-0 z-10 flex flex-col justify-around gap-4 bg-gradient-to-r from-black/80 via-black/50 to-transparent p-4 text-white sm:gap-5 sm:p-8 md:gap-6 md:p-20">
        <div className="flex flex-col gap-2">
          <h1 className="line-clamp-1 font-magnatbold font-bold drop-shadow sm:text-xl md:text-3xl">
            {displayTitle}
          </h1>
          {description && (
            <p className="line-clamp-2 text-xs font-bold sm:text-sm lg:max-w-[65%]">
              {parse(cleanDesc ?? "")}
            </p>
          )}
          <div className="flex gap-1 sm:gap-3">
            {genres?.slice(0, 3).map((genre, index) => (
              <Genre key={index} genre={genre} />
            ))}
          </div>
        </div>
        <div className="btn btn-sm w-fit rounded font-bold md:text-lg">
          <Link href={determineNavigateTo()}>Watch</Link>
        </div>
      </div>
    </div>
  );
}

export default HeroMedia;

