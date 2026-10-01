"use client";
import { AnimeEpisode } from "@/types/anime.type";
import { SeriesEpisode } from "@/types/movies.type";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();

  const epNum =
    (isAnime
      ? (episode as AnimeEpisode).number
      : (episode as SeriesEpisode).episode_number ?? (episode as AnimeEpisode).number) ?? 1;

  const isActive = String(epNum) === String(ep);

  const handleEpisodeClick = (episodeNumber: number, episodeId?: string) => {
    const query = isAnime
      ? {
          id,
          ep: episodeNumber,
          ...(isDub && { isDub: true }),
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
    <Button
      onClick={() =>
        handleEpisodeClick(
          epNum,
          isAnime ? (episode as AnimeEpisode).id : undefined
        )
      }
      size="sm"
      variant={isActive ? "default" : "outline"}
      className="font-mono text-xs tabular-nums"
    >
      {epNum}
    </Button>
  );
}

export default EpisodeComponent;
