import { Suspense } from "react";
import HeroMediaCarousel from "@/components/hero/HeroMediaCarousel";
import MangaSubtypeFilter from "@/components/manga/MangaSubtypeFilter";
import GenreFilter from "@/components/genre/GenreFilter";
import GenreFilterFallback from "@/components/genre/GenreFilterFallback";
import {
  MangaDefaultShelves,
  MangaSubtypeShell,
} from "@/components/manga/MangaCatalog";
import { MangaService } from "@/services";
import { MangaItem } from "@/types/manga.type";

export const revalidate = 300; // Cache on edge for 5 minutes

function MangaSubtypeFilterFallback() {
  return (
    <div className="w-full border-b border-hairline bg-surface-1 px-4 py-3 sm:px-6 lg:px-10">
      <div className="min-h-[58px] md:min-h-[34px]" />
    </div>
  );
}

export default async function MangaPage() {
  const [
    trendingSettled,
    popularManhwaSettled,
    popularMangaSettled,
    popularManhuaSettled,
  ] = await Promise.allSettled([
    MangaService.getTrendingManga("all", 1, 12),
    MangaService.getPopularManga("manhwa", 1, 16),
    MangaService.getPopularManga("manga", 1, 16),
    MangaService.getPopularManga("manhua", 1, 16),
  ]);

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

      <Suspense fallback={<MangaSubtypeFilterFallback />}>
        <MangaSubtypeFilter />
      </Suspense>

      <Suspense fallback={<GenreFilterFallback />}>
        <GenreFilter mediaType="manga" />
      </Suspense>

      <Suspense
        fallback={
          <MangaDefaultShelves
            trending={trendingItems}
            popularManhwa={popularManhwa}
            popularManga={popularManga}
            popularManhua={popularManhua}
          />
        }
      >
        <MangaSubtypeShell
          trending={trendingItems}
          popularManhwa={popularManhwa}
          popularManga={popularManga}
          popularManhua={popularManhua}
        />
      </Suspense>
    </div>
  );
}
