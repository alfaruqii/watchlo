import HeroMediaCarousel from "@/components/hero/HeroMediaCarousel";
import AnimeContainerCard from "../components/card/animecard/AnimeContainerCard";
import AnimeGenreFilter from "@/components/genre/AnimeGenreFilter";
import { AnimeServiceV1, AnimeServiceV2 } from "../services";
import { Anime } from "@/types/anime.type";

export const revalidate = 300; // Cache on edge for 5 minutes

interface AnimePageProps {
  searchParams: Promise<{ genre?: string }>;
}

export default async function AnimePage({ searchParams }: AnimePageProps) {
  const resolvedSearchParams = await searchParams;
  const activeGenre = resolvedSearchParams?.genre?.trim() || "";

  const [
    trendingSettled,
    recentSettled,
    popularSettled,
    genreFilterSettled,
  ] = await Promise.allSettled([
    AnimeServiceV2.getTrendingAnime(),
    AnimeServiceV1.getRecentEpisodeGogo(),
    AnimeServiceV2.getPopularAnime(),
    activeGenre
      ? AnimeServiceV2.advancedSearchAnime({
          genres: [activeGenre],
          size: 24,
          sort: ["TRENDING_DESC", "POPULARITY_DESC"],
        })
      : Promise.resolve({ data: { results: [] } }),
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

  const genreResults: Anime[] =
    genreFilterSettled.status === "fulfilled"
      ? genreFilterSettled.value.data?.results || []
      : [];

  const heroItems =
    activeGenre && genreResults.length > 0
      ? genreResults.slice(0, 5)
      : dataTrending.results;

  return (
    <div className="flex min-h-fit flex-col pb-8">
      <HeroMediaCarousel items={heroItems} />

      {/* Interactive Archival Genre Filter Bar */}
      <AnimeGenreFilter activeGenre={activeGenre || "all"} />

      {/* Filtered Genre Shelf if active */}
      {activeGenre && (
        <div className="px-4 sm:px-0">
          {genreResults.length > 0 ? (
            <AnimeContainerCard
              containerTitle={`Genre Archive — ${activeGenre}`}
              animes={genreResults}
            />
          ) : (
            <div className="mx-4 my-6 rounded-sm border border-hairline bg-surface-1 p-6 text-center sm:mx-6 lg:mx-10">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                No anime cataloged under genre &ldquo;{activeGenre}&rdquo; in current collection.
              </p>
            </div>
          )}
        </div>
      )}

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
