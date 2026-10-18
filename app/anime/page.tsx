import { Suspense } from "react";
import HeroMediaCarousel from "@/components/hero/HeroMediaCarousel";
import AnimeContainerCard from "../components/card/animecard/AnimeContainerCard";
import AnimeGenreFilter from "@/components/genre/AnimeGenreFilter";
import AnimeGenreShelf from "@/components/genre/AnimeGenreShelf";
import GenreFilterFallback from "@/components/genre/GenreFilterFallback";
import { AnimeServiceV1, AnimeServiceV2 } from "../services";

export const revalidate = 300; // Cache on edge for 5 minutes

export default async function AnimePage() {
  const [trendingSettled, recentSettled, popularSettled] =
    await Promise.allSettled([
      AnimeServiceV2.getTrendingAnime(),
      AnimeServiceV1.getRecentEpisodeGogo(),
      AnimeServiceV2.getPopularAnime(),
    ]);

  const dataTrending =
    trendingSettled.status === "fulfilled"
      ? trendingSettled.value.data
      : { results: [] };
  const dataRecent =
    recentSettled.status === "fulfilled"
      ? recentSettled.value.data
      : { results: [] };
  const dataPopular =
    popularSettled.status === "fulfilled"
      ? popularSettled.value.data
      : { results: [] };

  return (
    <div className="flex min-h-fit flex-col pb-8">
      <HeroMediaCarousel items={dataTrending.results} />

      {/* Interactive Archival Genre Filter Bar */}
      <Suspense fallback={<GenreFilterFallback />}>
        <AnimeGenreFilter />
      </Suspense>

      {/* Filtered Genre Shelf if active */}
      <Suspense fallback={null}>
        <AnimeGenreShelf />
      </Suspense>

      {dataRecent?.results?.length > 0 && (
        <div className="px-4 sm:px-0">
          <AnimeContainerCard
            containerTitle="Simulcast Desk — Recently Updated"
            animes={dataRecent.results}
          />
        </div>
      )}

      <div className="px-4 sm:px-0">
        <AnimeContainerCard
          containerTitle="Essential Catalog — Most Popular Anime"
          animes={dataPopular.results}
        />
      </div>

      <div className="px-4 sm:px-0">
        <AnimeContainerCard
          containerTitle="Seasonal Index — Trending Now"
          animes={dataTrending.results}
        />
      </div>
    </div>
  );
}
