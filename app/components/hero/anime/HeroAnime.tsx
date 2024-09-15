//HeroAnime.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import parse from 'html-react-parser';

type HeroAnimeProps = {
  id: number;
  title: { userPreferred: string };
  description: string;
  genres?: string[];
  bannerImage?: string;
  coverImage: { extraLarge: string };
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
            <h1 className="font-bold text-xs sm:text-sm line-clamp-2">
              {parse(cleanDesc ?? "Description unknown")}
            </h1>
            <div className="flex gap-1 sm:gap-3">
              {genres?.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className="rounded border border-gray-400 bg-gray-800 p-2 text-xs sm:text-base"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="btn btn-sm w-fit md:text-lg font-bold rounded">
            <Link href={`/anime/series/${id}/1`}>Watch</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroAnime;


