"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import AnimeContainerCard from "@/components/card/animecard/AnimeContainerCard";
import SkeletonMangaShelf from "@/components/skeleton/SkeletonMangaShelf";
import { Anime } from "@/types/anime.type";

const fetchGenreAnime = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch genre anime: ${res.status}`);
  return res.json();
};

export default function AnimeGenreShelf() {
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get("genre")?.trim() || "";

  const { data, isLoading } = useSWR<{ results?: Anime[] }>(
    activeGenre
      ? `/api/anime-search?genre=${encodeURIComponent(activeGenre)}`
      : null,
    fetchGenreAnime,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 300000,
    }
  );

  if (!activeGenre) return null;

  const genreResults: Anime[] = data?.results || [];

  return (
    <div className="px-4 sm:px-0">
      {isLoading ? (
        <SkeletonMangaShelf count={5} />
      ) : genreResults.length > 0 ? (
        <AnimeContainerCard
          containerTitle={`Genre Archive — ${activeGenre}`}
          animes={genreResults}
        />
      ) : (
        <div className="mx-4 my-6 rounded-sm border border-hairline bg-surface-1 p-6 text-center sm:mx-6 lg:mx-10">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            No anime cataloged under genre &ldquo;{activeGenre}&rdquo; in
            current collection.
          </p>
        </div>
      )}
    </div>
  );
}
