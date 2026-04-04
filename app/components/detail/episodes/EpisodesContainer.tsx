"use client";

import { useState, useEffect } from "react";
import { AnimeDetails, AnimeInfo } from "@/types/anime.type";
import { AnimeCardDetail } from "../card/AnimeCardDetail";
import SkeletonEpisodes from "@/components/skeleton/SkeletonEpisodes";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";

function EpisodesContainer(anime: AnimeInfo) {
  const { theme } = useThemeStore();
  const [provider, setProvider] = useState<string | undefined>(
    anime.id_provider?.idGogo
  );
  const [episodes, setEpisodes] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const isWhiteMode = (): boolean => theme === "garden";

  useEffect(() => {
    async function fetchEpisodes() {
      if (provider) {
        setLoading(true);
        try {
          const response = await fetch(`/api/anime-infov1?query=${provider}`);
          if (!response.ok) {
            throw new Error("Failed to fetch search results");
          }
          const data = await response.json();
          setEpisodes(data);
        } catch (error) {
          console.error("Failed to fetch episodes:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchEpisodes();
  }, [provider]);

  return (
    <div className="overflow-hidden sm:px-4 py-4">
      <div className="mb-2 flex gap-1">
        {anime.id_provider?.idGogoDub && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={`${
              provider === anime.id_provider?.idGogo
                ? `bg-gray-400 ${
                    !isWhiteMode() ? "text-gray-800 hover:text-gray-100" : ""
                  }`
                : ``
            }`}
            onClick={() => setProvider(anime.id_provider?.idGogo)}
            disabled={!anime.id_provider?.idGogo}
          >
            Sub
          </Button>
        )}
        {anime.id_provider?.idGogoDub && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={`${
              provider === anime.id_provider?.idGogoDub
                ? `bg-gray-400 ${
                    !isWhiteMode() ? "text-gray-800 hover:text-gray-100" : ""
                  }`
                : ""
            }`}
            onClick={() => setProvider(anime.id_provider?.idGogoDub)}
            disabled={!anime.id_provider?.idGogoDub}
          >
            Dub
          </Button>
        )}
      </div>

      {loading ? (
        <SkeletonEpisodes noMargin />
      ) : episodes?.episodes.length ? (
        <div className="embla__container scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative flex w-full gap-4 overflow-x-scroll pb-2 scrollbar-track-gray-300 scrollbar-thumb-gray-800">
          {episodes.episodes.map((episode) => (
            <AnimeCardDetail
              key={episode.id}
              animeImage={episodes.image}
              id={String(anime.id)}
              episodeNumber={episode.number}
              // example: jujutsu-kaisen-tv-episode-1
              episodeId={episode.id}
            />
          ))}
        </div>
      ) : (
        <div>No episodes available</div>
      )}
    </div>
  );
}

export default EpisodesContainer;
