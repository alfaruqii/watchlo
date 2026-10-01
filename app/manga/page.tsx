import { Suspense } from "react";
import HeroMediaCarousel from "@/components/hero/HeroMediaCarousel";
import MangaContainerCard from "@/components/card/mangacard/MangaContainerCard";
import MangaSubtypeFilter from "@/components/manga/MangaSubtypeFilter";
import GenreFilter from "@/components/genre/GenreFilter";
import SkeletonMangaShelf from "@/components/skeleton/SkeletonMangaShelf";
import { MangaService } from "@/services";
import { MangaItem, MangaSubtype } from "@/types/manga.type";

export const revalidate = 300; // Cache on edge for 5 minutes

interface MangaPageProps {
  searchParams: Promise<{ subtype?: string; genre?: string }>;
}

export default async function MangaPage({ searchParams }: MangaPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawSubtype = resolvedSearchParams?.subtype;
  const activeGenre = resolvedSearchParams?.genre?.trim() || "";
  const activeSubtype: MangaSubtype =
    rawSubtype === "manhwa" ||
    rawSubtype === "manga" ||
    rawSubtype === "manhua"
      ? rawSubtype
      : "all";

  if (activeSubtype !== "all") {
    // Focused view for a specific subtype — execute all in parallel
    const [genreSettled, trendingSettled, popularSettled] = await Promise.allSettled([
      activeGenre
        ? MangaService.searchManga(activeGenre, activeSubtype, 1, 24)
        : Promise.resolve(null),
      MangaService.getTrendingManga(activeSubtype, 1, 15),
      MangaService.getPopularManga(activeSubtype, 1, 20),
    ]);

    const genreItems: MangaItem[] =
      genreSettled.status === "fulfilled" && genreSettled.value
        ? genreSettled.value.data?.results ||
          genreSettled.value.data?.data?.results ||
          []
        : [];

    const trendingItems: MangaItem[] =
      trendingSettled.status === "fulfilled"
        ? trendingSettled.value.data?.data?.results ||
          trendingSettled.value.data?.results ||
          []
        : [];

    const popularItems: MangaItem[] =
      popularSettled.status === "fulfilled"
        ? popularSettled.value.data?.data?.results ||
          popularSettled.value.data?.results ||
          []
        : [];

    const subtypeTitle =
      activeSubtype === "manhwa"
        ? "Korean Manhwa & Webtoons"
        : activeSubtype === "manga"
        ? "Japanese Manga Serials"
        : "Chinese Manhua Chronicles";

    // Resilient hero items: prioritize trending, fallback to popular if upstream trending is empty
    const heroItems: MangaItem[] =
      trendingItems.length > 0 ? trendingItems : popularItems;

    // Resilient trending shelf: if trending is empty, present top archival editions
    const displayTrending =
      trendingItems.length > 0 ? trendingItems : popularItems.slice(0, 15);

    return (
      <div className="flex min-h-fit flex-col pb-10">
        {heroItems.length > 0 && <HeroMediaCarousel items={heroItems} />}
        <MangaSubtypeFilter activeSubtype={activeSubtype} />
        <GenreFilter mediaType="manga" activeGenre={activeGenre || "all"} />

        {activeGenre && (
          <div className="px-4 sm:px-0">
            {genreItems.length > 0 ? (
              <MangaContainerCard
                containerTitle={`Genre Archive — ${activeGenre}`}
                subtitle={`Curated ${subtypeTitle} filtered by genre`}
                mangas={genreItems}
              />
            ) : (
              <div className="mx-4 my-6 rounded-sm border border-hairline bg-surface-1 p-6 text-center sm:mx-6 lg:mx-10">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  No {subtypeTitle} cataloged under genre &ldquo;{activeGenre}&rdquo; in current collection.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="px-4 sm:px-0">
          <MangaContainerCard
            containerTitle={`${subtypeTitle} — Trending Releases`}
            subtitle="Real-time community circulation"
            mangas={displayTrending}
          />
        </div>

        <div className="px-4 sm:px-0">
          <MangaContainerCard
            containerTitle={`${subtypeTitle} — All-Time Essential`}
            subtitle="Highest scoring & read archival editions"
            mangas={popularItems}
          />
        </div>
      </div>
    );
  }

  // Default "All" overview — execute all queries in parallel
  const [
    genreSettled,
    trendingSettled,
    popularManhwaSettled,
    popularMangaSettled,
    popularManhuaSettled,
  ] = await Promise.allSettled([
    activeGenre
      ? MangaService.searchManga(activeGenre, "all", 1, 24)
      : Promise.resolve(null),
    MangaService.getTrendingManga("all", 1, 12),
    MangaService.getPopularManga("manhwa", 1, 16),
    MangaService.getPopularManga("manga", 1, 16),
    MangaService.getPopularManga("manhua", 1, 16),
  ]);

  const genreItems: MangaItem[] =
    genreSettled.status === "fulfilled" && genreSettled.value
      ? genreSettled.value.data?.results ||
        genreSettled.value.data?.data?.results ||
        []
      : [];

  const trendingItems: MangaItem[] =
    trendingSettled.status === "fulfilled"
      ? trendingSettled.value.data?.data?.results ||
        trendingSettled.value.data?.results ||
        []
      : [];

  const popularManhwa: MangaItem[] =
    popularManhwaSettled.status === "fulfilled"
      ? popularManhwaSettled.value.data?.data?.results ||
        popularManhwaSettled.value.data?.results ||
        []
      : [];

  const popularManga: MangaItem[] =
    popularMangaSettled.status === "fulfilled"
      ? popularMangaSettled.value.data?.data?.results ||
        popularMangaSettled.value.data?.results ||
        []
      : [];

  const popularManhua: MangaItem[] =
    popularManhuaSettled.status === "fulfilled"
      ? popularManhuaSettled.value.data?.data?.results ||
        popularManhuaSettled.value.data?.results ||
        []
      : [];

  const heroItems: MangaItem[] =
    trendingItems.length > 0
      ? trendingItems
      : popularManhwa.length > 0
      ? popularManhwa
      : popularManga;

  return (
    <div className="flex min-h-fit flex-col pb-10">
      {heroItems.length > 0 && <HeroMediaCarousel items={heroItems} />}
      <MangaSubtypeFilter activeSubtype={activeSubtype} />
      <GenreFilter mediaType="manga" activeGenre={activeGenre || "all"} />

      {activeGenre && (
        <div className="px-4 sm:px-0">
          {genreItems.length > 0 ? (
            <MangaContainerCard
              containerTitle={`Genre Archive — ${activeGenre}`}
              subtitle="Curated serials & volumes filtered by genre"
              mangas={genreItems}
            />
          ) : (
            <div className="mx-4 my-6 rounded-sm border border-hairline bg-surface-1 p-6 text-center sm:mx-6 lg:mx-10">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                No titles cataloged under genre &ldquo;{activeGenre}&rdquo; in current collection.
              </p>
            </div>
          )}
        </div>
      )}

      <Suspense fallback={<SkeletonMangaShelf count={7} />}>
        <div className="px-4 sm:px-0">
          <MangaContainerCard
            containerTitle="Manga & Manhwa Repertory — Trending Now"
            subtitle="Top serialized publications across all mediums"
            mangas={trendingItems}
          />
        </div>
      </Suspense>

      <Suspense fallback={<SkeletonMangaShelf count={7} />}>
        <div className="px-4 sm:px-0">
          <MangaContainerCard
            containerTitle="Webtoon Strip Gallery — Popular Manhwa"
            subtitle="Full vertical color editions from Korea"
            mangas={popularManhwa}
          />
        </div>
      </Suspense>

      <Suspense fallback={<SkeletonMangaShelf count={7} />}>
        <div className="px-4 sm:px-0">
          <MangaContainerCard
            containerTitle="Print Classic Archive — Popular Manga"
            subtitle="Curated Japanese serialized masterpieces"
            mangas={popularManga}
          />
        </div>
      </Suspense>

      {popularManhua.length > 0 && (
        <Suspense fallback={<SkeletonMangaShelf count={7} />}>
          <div className="px-4 sm:px-0">
            <MangaContainerCard
              containerTitle="Imperial Serials — Popular Manhua"
              subtitle="Cultivation, historical & fantasy from China"
              mangas={popularManhua}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
}
