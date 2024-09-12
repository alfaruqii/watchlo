import Image from "next/image";
import { Anime } from "@/app/types/anime.type";
import Link from "next/link";

function HeroAnime({ id, title, bannerImage, coverImage, genres }: Anime) {
  return (
    <>
      <div className="carousel-item relative w-full overflow-x-scroll">
        {
          (bannerImage || coverImage.extraLarge) &&
          <Image alt={`${title.userPreferred}`} src={`${bannerImage ?? coverImage.extraLarge}`} fill className="inset-0 z-0 h-full w-full object-cover" />
        }
        <div className="inset-0 z-10 flex flex-col justify-around gap-4 sm:gap-5 md:gap-6 bg-gradient-to-r from-black/80 via-black/50 to-transparent p-4 text-white sm:p-8 md:p-12">
          <h1 className="line-clamp-1 font-magnatbold font-bold sm:text-xl md:text-3xl">
            {
              title.userPreferred
            }
          </h1>
          <div className="flex gap-1 sm:gap-3">
            {
              genres.slice(0, 3).map((genre) => (
                <span className="rounded border border-gray-400 bg-gray-800 p-2 text-xs sm:text-base">
                  {
                    genre
                  }
                </span>
              ))
            }
          </div>
          <div className="btn btn-sm w-fit md:text-lg font-bold rounded-lg">
            <Link href={`/anime/series/${id}/1`}>Watch</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroAnime;
