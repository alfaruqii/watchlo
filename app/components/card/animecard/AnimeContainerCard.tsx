"use client";

import { useThemeStore } from '@/store/themeStore'
import { AnimeCard } from './AnimeCard'
import { AnimeType, Relation } from '@/types/anime.type'

interface AnimeContainerProps {
  animes: AnimeType[] | Relation[];
  containerTitle: string
}

// Type guard function
function isRelationArray(arr: AnimeType[] | Relation[]): arr is Relation[] {
  return 'relation' in arr[0];
}

export const AnimeContainerCard = ({ animes, containerTitle }: AnimeContainerProps) => {
  const { theme } = useThemeStore();

  return (
    <div className={`overflow-hidden ${isRelationArray(animes) ? "p-4" : "sm:p-4"}`}>
      <p className={`mb-4 pb-2 font-bold border-b ${theme === "garden" ? "border-black" : "border-gray-200"}`}>
        {containerTitle}
      </p>
      <div className="flex embla__container gap-4 relative w-full overflow-x-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-800 scrollbar-track-gray-300 pb-2">
        {animes.map((item) => (
          <AnimeCard
            key={item.id}
            anime={item as AnimeType}
          />
        ))}
      </div>
    </div>
  )
}
