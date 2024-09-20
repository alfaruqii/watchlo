"use client";
import { useThemeStore } from '@/store/themeStore'
import { AnimeCard } from './AnimeCard'
import { AnimeType } from '@/types/anime.type'

interface AnimeContainerProps {
  animes: AnimeType[]
  containerTitle: string
}

export const AnimeContainerCard = ({ animes, containerTitle }: AnimeContainerProps) => {
  const { theme } = useThemeStore();
  return (
    <div className="p-4 overflow-hidden">
      <p className={`mb-4 pb-2 font-bold border-b ${theme === "garden" ? "border-black" : "border-gray-200"}`}>{containerTitle}</p>
      <div className="flex embla__container gap-4 relative w-full overflow-x-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-800 scrollbar-track-gray-300 pb-2">
        {
          animes.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
            />
          ))
        }
      </div>
    </div>
  )
}

