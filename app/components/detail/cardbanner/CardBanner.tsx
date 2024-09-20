import Image from "next/image";
import { AnimeInfo } from "@/types/anime.type"

function CardBanner(anime: AnimeInfo) {
  return (
    <>
      <div className="absolute flex items-center gap-4 z-20 overflow-hidden top-24 drop-shadow-lg left-5 lg:left-32 lg:top-36">
        <Image
          alt={`${anime.title?.userPreferred}`}
          src={`${anime.coverImage?.large ?? ""}`}
          width={2000}
          height={2000}
          className="object-cover w-24 lg:w-40 rounded"
        />
        <div className="flex flex-col gap-1">
          <p className="text-white font-magnatbold max-w-full sm:text-xl lg:text-2xl line-clamp-1">
            {anime.title?.userPreferred}
          </p>
          <div className="flex gap-1 sm:gap-3 text-xs sm:text-base text-white">
            {
              anime.genres?.slice(0, 3).map((genre: string, i: number) =>
                <span key={i} className="bg-gray-400/60 p-1 rounded">
                  {
                    genre
                  }
                </span>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default CardBanner;
