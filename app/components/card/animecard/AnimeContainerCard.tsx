"use client";

import { useThemeStore } from "@/store/themeStore";
import AnimeCard from "./AnimeCard";
import { AnimeType, RelationOrRecommendation } from "@/types/anime.type";

interface AnimeContainerProps {
  animes: AnimeType[] | RelationOrRecommendation[];
  containerTitle: string;
}

const AnimeContainerCard = ({
  animes,
  containerTitle,
}: AnimeContainerProps) => {
  const { theme } = useThemeStore();

  return (
    <div className="overflow-hidden sm:p-4">
      <p
        className={`mb-4 pb-1 font-bold border-b ${
          theme === "garden" ? "border-black" : "border-gray-200"
        }`}
      >
        {containerTitle}
      </p>
      <div className="flex embla__container gap-4 relative w-full overflow-x-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-800 scrollbar-track-gray-300 pb-2">
        {animes?.map(
          (item) =>
            item && <AnimeCard key={item?.id} anime={item as AnimeType} />
        )}
      </div>
    </div>
  );
};

export default AnimeContainerCard;
