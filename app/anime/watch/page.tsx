// WatchPage.tsx
"use client";
import useSWR from "swr";
import EpisodesComponent from "@/components/watch/episodes/EpisodesComponent";
import Error from "@/error";
import { Media } from "@/components/media/Media";
import { AnimeServiceV1, AnimeServiceV2 } from "@/services";
import { AnimeDetails, AnimeInfo } from "@/types/anime.type";
import { useState, useEffect, useCallback } from "react";

type WatchPageParams = {
  searchParams: { id: string; ep: string; isDub?: string };
};

// Get the Episode From Gogo
const fetchAnimeInfoV1 = async (idProvider: string) => {
  if (!idProvider) return null;
  let res = await AnimeServiceV1.getAnimeInfoV1Gogo(idProvider);
  return res.data;
};

const fetchAnimeInfoV2 = async (id: string) => {
  const res = await AnimeServiceV2.getAnimeInfoV2(id);
  return res.data;
};

function WatchPage({ searchParams }: WatchPageParams) {
  const { id, ep, isDub } = searchParams;
  // Store the selected episode ID for stream fetching (v1)
  const [episodeId, setEpisodeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  // const [provider, setProvider] = useState("");

  // Fetch data from API v2 to get id_provider
  const { data: animeInfoV2, error: errorInfoV2 } = useSWR<AnimeInfo>(
    id,
    fetchAnimeInfoV2
  );

  // Fetch data from API v1 using the id_provider from API v2
  const { data: animeInfoV1, error: errorInfoV1 } = useSWR<AnimeDetails>(
    () =>
      !isDub
        ? animeInfoV2?.id_provider.idGogo
        : animeInfoV2?.id_provider.idGogoDub || null,
    fetchAnimeInfoV1
  );

  // Set the initial episode ID once the anime info and episodes are loaded
  useEffect(() => {
    if (animeInfoV1?.episodes && ep) {
      const selectedEpisode = animeInfoV1?.episodes.find(
        (e) => Number(e.number) === Number(ep)
      );
      if (selectedEpisode) {
        setEpisodeId(selectedEpisode.id);
        setIsLoading(false);
      }
    }
  }, [animeInfoV1, ep]);

  // Handle episode change through the EpisodesComponent
  const handleEpisodeChange = useCallback(
    (newEpisodeId: string) => {
      setEpisodeId(newEpisodeId);
    },
    [episodeId]
  );

  // Handle loading and error states
  if (errorInfoV2 || errorInfoV1) return <Error />;
  if (isLoading || !animeInfoV2 || !animeInfoV1) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6 p-6 lg:grid lg:grid-cols-5">
      <Media
        title={animeInfoV1.title}
        poster={animeInfoV1.image}
        episodeId={episodeId}
        ep={ep}
      />
      <EpisodesComponent
        id={id}
        item={animeInfoV1}
        ep={ep}
        isDub={isDub}
        handleEpisodeChange={handleEpisodeChange}
      />
    </div>
  );
}

export default WatchPage;
