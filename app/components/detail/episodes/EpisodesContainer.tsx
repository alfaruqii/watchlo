"use client";

import { useState, useEffect } from "react";
import { AnimeDetails, AnimeInfo } from "@/types/anime.type"
import { AnimeCardDetail } from "../card/AnimeCardDetail";
import SkeletonEpisodes from "@/components/skeleton/SkeletonEpisodes";
import { useThemeStore } from "@/store/themeStore";

function EpisodesContainer(anime: AnimeInfo) {
  const { theme } = useThemeStore();
  const [provider, setProvider] = useState<string | undefined>(anime.id_provider?.idGogo);
  const [episodes, setEpisodes] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEpisodes() {
      if (provider) {
        setLoading(true);
        try {
          const response = await fetch(`/api/anime-infov1?query=${provider}`);
          if (!response.ok) {
            throw new Error('Failed to fetch search results')
          }
          const data = await response.json()
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
        {
          anime.id_provider?.idGogoDub && (
            <button
              type="button"
              className={`${provider === anime.id_provider?.idGogo ? `bg-gray-400 ${theme !== "garden" ? "text-gray-800" : ""}` : ``} btn btn-sm`}
              onClick={() => setProvider(anime.id_provider?.idGogo)}
              disabled={!anime.id_provider?.idGogo}
            >
              Sub
            </button>
          )
        }
        {
          anime.id_provider?.idGogoDub && (
            <button
              type="button"
              className={`${provider === anime.id_provider?.idGogoDub ? `bg-gray-400 ${theme !== "garden" ? "text-gray-800" : ""}` : ''} btn btn-sm`}
              onClick={() => setProvider(anime.id_provider?.idGogoDub)}
              disabled={!anime.id_provider?.idGogoDub}
            >
              Dub
            </button>
          )
        }
      </div>

      {loading ? (
        <SkeletonEpisodes noMargin />
      ) : episodes ? (
        <div className="embla__container scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative flex w-full gap-4 overflow-x-scroll pb-2 scrollbar-track-gray-300 scrollbar-thumb-gray-800">
          {episodes.episodes.map((episode) => (
            <AnimeCardDetail
              key={episode.id}
              animeImage={episodes.image}
              id={episodes.id}
              episodeNumber={episode.number}
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
