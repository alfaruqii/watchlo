"use client";

import { useThemeStore } from "@/store/themeStore";
import { MoviesCard } from "./MoviesCard";
import { MovieInfo, TVInfo } from "@/types/movies.type";

interface MoviesContainerProps {
  movies: MovieInfo[] | TVInfo[];
  containerTitle: string;
  isDetail?: boolean;
  season?: number;
  ep?: number;
}

export const MoviesContainerCard = ({
  movies,
  containerTitle,
  isDetail = true,
  season,
  ep,
}: MoviesContainerProps) => {
  const { theme } = useThemeStore();

  return (
    <div className="overflow-hidden sm:p-4">
      {containerTitle && (
        <p
          className={`${
            theme === "garden" ? "border-black" : "border-gray-200"
          } mb-4 border-b pb-2
          font-bold`}
        >
          {containerTitle}
        </p>
      )}
      <div className="embla__container scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative flex w-full gap-4 overflow-x-scroll pb-2 scrollbar-track-gray-300 scrollbar-thumb-gray-800">
        {movies.map((item, i) => (
          <MoviesCard
            key={i}
            movie={item}
            isDetail={isDetail}
            season={season}
            ep={ep}
          />
        ))}
      </div>
    </div>
  );
};
