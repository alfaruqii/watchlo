import { notFound } from "next/navigation";
import Banner from "@/components/detail/banner/Banner";
import CardBanner from "@/components/detail/cardbanner/CardBanner";
import MangaInfoDetails from "@/components/manga/MangaInfoDetails";
import MangaChapterRack from "@/components/manga/MangaChapterRack";
import MangaContainerCard from "@/components/card/mangacard/MangaContainerCard";
import AnimeVoiceActorsRack from "@/components/detail/credits/AnimeVoiceActorsRack";
import RelatedGenreRack from "@/components/detail/genre/RelatedGenreRack";
import { MangaService } from "@/services";
import { MangaDetailInfo, MangaChaptersResponse, MangaItem } from "@/types/manga.type";
import { AnimeCreditsResponse } from "@/types/anime.type";

export const revalidate = 1800; // Cache on edge for 30 minutes

interface MangaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id || !Number.isInteger(Number(id))) {
    notFound();
  }

  const [infoSettled, chaptersSettled, recommendationsSettled, creditsSettled] =
    await Promise.allSettled([
      MangaService.getMangaInfo(id),
      MangaService.getMangaChapters(id, "all"),
      MangaService.getMangaRecommendations(id),
      MangaService.getMangaCredits(id),
    ]);

  const rawInfo =
    infoSettled.status === "fulfilled"
      ? infoSettled.value.data?.data || infoSettled.value.data
      : null;

  if (!rawInfo || !rawInfo.id) {
    notFound();
  }

  const mangaInfo: MangaDetailInfo = rawInfo;
  const rawChapters =
    chaptersSettled.status === "fulfilled"
      ? chaptersSettled.value.data?.data || chaptersSettled.value.data
      : null;

  const chaptersData: MangaChaptersResponse = {
    anilistId: Number(id),
    totalChapters: rawChapters?.totalChapters || rawChapters?.chapters?.length || 0,
    availableLanguages: rawChapters?.availableLanguages || [],
    providers: rawChapters?.providers || [],
    chapters: rawChapters?.chapters || [],
  };

  const recommendations: MangaItem[] =
    recommendationsSettled.status === "fulfilled"
      ? recommendationsSettled.value.data?.results ||
        recommendationsSettled.value.data?.data?.results ||
        []
      : [];

  const credits: AnimeCreditsResponse | null =
    creditsSettled.status === "fulfilled"
      ? creditsSettled.value.data
      : null;

  return (
    <div className="pb-12">
      <Banner item={mangaInfo} />
      <div className="px-4 sm:px-6 lg:px-10">
        <CardBanner item={mangaInfo} />
        <MangaInfoDetails item={mangaInfo} />
        {credits && (credits.characters?.length > 0 || credits.staff?.length > 0) && (
          <AnimeVoiceActorsRack
            characters={credits.characters}
            staff={credits.staff}
            isManga={true}
            title="Characters & Creative Mangaka"
          />
        )}
        <RelatedGenreRack genres={mangaInfo.genres || []} tags={mangaInfo.tags || []} type="manga" />
        <MangaChapterRack
          mangaId={Number(id)}
          chapters={chaptersData.chapters || []}
          availableLanguages={chaptersData.availableLanguages || []}
          providers={chaptersData.providers || []}
        />
      </div>
      {recommendations.length > 0 && (
        <div className="mt-6 px-4 sm:px-0">
          <MangaContainerCard
            mangas={recommendations}
            containerTitle="Curated Archival Recommendations"
            subtitle="Similar art styles & narrative arcs"
          />
        </div>
      )}
    </div>
  );
}
