//HeroAnime.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import parse from 'html-react-parser';
import { CoverImage, Title } from "@/app/types/anime.type";
import Genre from "../../genre/Genre";

type HeroAnimeProps = {
  id: number;
  title: Title;
  description: string;
  genres?: string[];
  bannerImage?: string;
  coverImage: CoverImage;
};


function HeroAnime({ id, title, description, bannerImage, coverImage, genres }: HeroAnimeProps) {
  const cleanDesc = description?.replace(/<br\s*\/?>/gi, '');
  return (
    <>
      <div className="relative w-full embla__slide flex" key={id}>
        {(bannerImage || coverImage.extraLarge) && (
          <Image
            alt={`${title.userPreferred}`}
            src={`${bannerImage ?? coverImage.extraLarge}`}
            fill
            className="inset-0 z-0 h-full w-full object-cover"
          />
        )}
        <div className="inset-0 z-10 flex flex-col justify-around gap-4 sm:gap-5 md:gap-6 bg-gradient-to-r from-black/80 via-black/50 to-transparent p-4 text-white sm:p-8 md:p-20">
          <div className="flex flex-col gap-2">
            <h1 className="line-clamp-1 font-magnatbold font-bold drop-shadow sm:text-xl md:text-3xl">
              {title.userPreferred}
            </h1>
            {
              description &&
              <h1 className="font-bold text-xs sm:text-sm line-clamp-2">
                {parse(cleanDesc ?? "")}
              </h1>
            }
            <div className="flex gap-1 sm:gap-3">
              {genres?.slice(0, 3).map((genre, index) => (
                <Genre index={index} genre={genre} />
              ))}
            </div>
          </div>
          <div className="btn btn-sm w-fit md:text-lg font-bold rounded">
            <Link href={`/anime/detail/${id}`}>Watch</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroAnime;


