"use client";

import { useThemeStore } from '@/store/themeStore'
import { MoviesCard } from './MoviesCard'
import { MovieInfo, TVInfo } from '@/types/movies.type';

interface MoviesContainerProps {
  movies: MovieInfo[] | TVInfo[];
  containerTitle: string
  isDetail?: boolean;
  season?: number;
  ep?: number;
}

export const MoviesContainerCard = ({ movies, containerTitle, isDetail = true, season, ep }: MoviesContainerProps) => {
  const { theme } = useThemeStore();

  return (
    <div className="overflow-hidden sm:p-4">
      {
        containerTitle &&
        <p className={`mb-4 pb-2 font-bold border-b ${theme === "garden" ? "border-black" : "border-gray-200"}`}>
          {containerTitle}
        </p>
      }
      <div className="flex embla__container gap-4 relative w-full overflow-x-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-800 scrollbar-track-gray-300 pb-2">
        {movies.map((item) => (
          <MoviesCard
            key={item.id}
            movie={item}
            isDetail={isDetail}
            season={season}
            ep={ep}
          />
        ))}
      </div>
    </div>
  )
}
