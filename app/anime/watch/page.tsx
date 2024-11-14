// WatchPage.tsx
"use client";
import useSWR from "swr";
import EpisodesComponent from "@/components/watch/episodes/EpisodesComponent";
import Media from "@/components/media/Media";
import Error from "@/error";
import Loading from "./loading";
import { AnimeDetails, AnimeInfo } from "@/types/anime.type";
import { useState, useEffect, useCallback, use } from "react";

type WatchPageParams = {
  searchParams: Promise<{ id: string; ep: string; isDub?: string }>;
};

const doesIdNumber = (id: unknown): boolean => Number.isInteger(Number(id));

// Fetch Anime Info based on ID
const fetchAnimeInfoV1 = async (idProvider: string) => {
  if (!idProvider) return null;
  const res = await fetch(`/api/anime-infov1?query=${idProvider}`);
  return res.json();
};

const fetchAnimeInfoV2 = async (id: string) => {
  if (doesIdNumber(id)) {
    const res = await fetch(`/api/anime-infov2?query=${id}`);
    return res.json();
  }
};

function WatchPage(props: WatchPageParams) {
  const searchParams = use(props.searchParams);
  const { id, ep, isDub } = searchParams;

  const [episodeId, setEpisodeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API v2 and API v1 separately
  const { data: animeInfoV2, error: errorInfoV2 } = useSWR<AnimeInfo>(
    doesIdNumber(id) ? id : null,
    fetchAnimeInfoV2
  );

  const idProvider = isDub
    ? animeInfoV2?.id_provider.idGogoDub
    : animeInfoV2?.id_provider.idGogo || id;

  const { data: animeInfoV1, error: errorInfoV1 } = useSWR<AnimeDetails>(
    idProvider ? [idProvider, "v1"] : null,
    () => fetchAnimeInfoV1(idProvider!)
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
  const handleEpisodeChange = useCallback((newEpisodeId: string) => {
    setEpisodeId(newEpisodeId);
  }, []);

  // Handle loading and error states
  if (errorInfoV2 || errorInfoV1) return <Error />;
  if (!animeInfoV2 && doesIdNumber(id)) return <Loading />;
  if (isLoading || !animeInfoV1) return <Loading />;

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
