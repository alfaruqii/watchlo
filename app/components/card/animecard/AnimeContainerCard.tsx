"use client";
import { Suspense } from 'react';
import { useThemeStore } from '@/app/store/themeStore'
import { AnimeCard } from './AnimeCard'
import { AnimeType } from '@/app/types/anime.type'

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
            <Suspense
              key={anime.id}
              fallback={<div className="card max-h-44 min-h-44 min-w-32 rounded sm:max-h-72 sm:min-h-72 sm:min-w-52">Loading feed...</div>}>
              <AnimeCard
                anime={anime}
              />
            </Suspense>
          ))
        }
      </div>
    </div>
  )
}

