"use client";
import { useThemeStore } from "@/store/themeStore";
import { AnimeEpisode } from "@/types/anime.type";
import { SeriesEpisode } from "@/types/movies.type";
import { useRouter } from "next/navigation";

type Episode = {
  isDub?: string;
  episode: AnimeEpisode | SeriesEpisode;
  isAnime: boolean;
  id: string;
  season?: string;
  ep?: string;
  handleEpisodeChange?: (id: string) => void;
};

function EpisodeComponent({
  isDub,
  episode,
  isAnime,
  id,
  season = "1",
  ep,
  handleEpisodeChange,
}: Episode) {
  const { theme } = useThemeStore();
  const router = useRouter();

  const isWhiteMode = (): boolean => theme === "garden";

  const activeEpisode = (episodeNumber: number): string => {
    const isActive = String(episodeNumber) === String(ep);
    if (isActive && isWhiteMode()) {
      return "bg-gray-700 text-white";
    }
    if (isActive && !isWhiteMode()) {
      return "bg-gray-600";
    }
    return "";
  };

  const handleEpisodeClick = (episodeNumber: number, episodeId?: string) => {
    const query = isAnime
      ? {
          id,
          ep: episodeNumber,
          ...(isDub && { isDub: true }), // Only add isDub if it's true
        }
      : { id, season, ep: episodeNumber };
    const queryString = new URLSearchParams(
      Object.entries(query).map(([key, value]) => [key, String(value)])
    ).toString();
    const fullPath = `${
      isAnime ? "/anime/watch" : "/series/watch"
    }?${queryString}`;

    if (handleEpisodeChange && episodeId) {
      handleEpisodeChange(episodeId);
    }
    router.push(fullPath);
  };

  return (
    <button
      onClick={() =>
        handleEpisodeClick(
          isAnime
            ? (episode as AnimeEpisode).number
            : (episode as SeriesEpisode).episode_number
        )
      }
      className={`btn ${activeEpisode(
        isAnime
          ? (episode as AnimeEpisode).number
          : (episode as SeriesEpisode).episode_number
      )}`}
    >
      {isAnime
        ? (episode as AnimeEpisode).number
        : (episode as SeriesEpisode).episode_number}
    </button>
  );
}

export default EpisodeComponent;
