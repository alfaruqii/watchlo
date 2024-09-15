"use client";
import { Suspense } from 'react';
import { useThemeStore } from '@/app/store/themeStore'
import { AnimeCard } from './AnimeCard'
import { AnimeType } from '@/app/types/anime.type'

interface AnimeContainerProps {
  animes: AnimeType[]
  containerTitle: string
  isTrending?: boolean // A flag to differentiate between trending/popular, etc.
  isPopular?: boolean
}

export const AnimeContainerCard = ({ animes, containerTitle }: AnimeContainerProps) => {
  const { theme } = useThemeStore();
  return (
    <div className="p-4">
      <p className={`mb-4 pb-2 font-bold border-b ${theme === "garden" ? "border-black" : "border-gray-200"}`}>{containerTitle}</p>
      <div className="flex embla__container gap-4 relative w-full overflow-x-scroll no-scrollbar">
        {
          animes.map((anime) => (
            <Suspense fallback={<div className="card max-h-44 min-h-44 min-w-32 rounded sm:max-h-72 sm:min-h-72 sm:min-w-52">Loading feed...</div>}>
              <AnimeCard
                key={anime.id}
                anime={anime}
              />
            </Suspense>
          ))
        }
      </div>
    </div>
  )
}

