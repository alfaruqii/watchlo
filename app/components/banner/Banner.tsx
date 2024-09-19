import Image from "next/image";
import { AnimeInfo } from "@/app/types/anime.type"

export const Banner = (anime: AnimeInfo) => {
  return (
    <>
      <div className="relative flex w-full" key={anime.id}>
        {anime.bannerImage && (
          <Image
            alt={`${anime.title?.userPreferred}`}
            src={`${anime.bannerImage ?? anime.coverImage?.large ?? ""}`}
            fill
            className="inset-0 z-0 h-full w-full object-cover"
          />
        )}
        <div className="inset-0 z-10 flex w-screen flex-col justify-around gap-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-20 text-white sm:gap-5 md:gap-6 lg:p-32">
        </div>
      </div>
    </>
  )
}
