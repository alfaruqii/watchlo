import { Suspense } from "react";
import { notFound } from "next/navigation";

import Banner from "@/components/detail/banner/Banner";
import CardBanner from "@/components/detail/cardbanner/CardBanner";
import AnimeContainerCard from "@/components/card/animecard/AnimeContainerCard";
import EpisodesContainer from "@/components/detail/episodes/EpisodesContainer";
import RelationComponent from "@/components/detail/relation/RelationComponent";
import InfoDetails from "@/components/detail/infodetails/InfoDetails";
import AnimeVoiceActorsRack from "@/components/detail/credits/AnimeVoiceActorsRack";
import AnimeProductionRack, { ProductionWorkItem } from "@/components/detail/credits/AnimeProductionRack";
import RelatedGenreRack from "@/components/detail/genre/RelatedGenreRack";
import Trailer from "@/components/media/Trailer";
import SkeletonEpisodes from "@/components/skeleton/SkeletonEpisodes";

import { AnimeServiceV2 } from "@/services";
import { AnimeInfo, RelationOrRecommendation, AnimeCreditsResponse } from "@/types/anime.type";

async function DetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!Number.isInteger(Number(id))) {
    notFound();
  }

  const [
    { data: dataInfo },
    {
      data: { results: dataRecommendations },
    },
    creditsRes,
  ]: [
    { data: AnimeInfo },
    { data: { results: RelationOrRecommendation[] } },
    { data: AnimeCreditsResponse } | null,
  ] = await Promise.all([
    AnimeServiceV2.getAnimeInfoV2(id),
    AnimeServiceV2.getRecommendationAnime(id).catch(() => ({
      data: { results: [] },
    })),
    AnimeServiceV2.getCredits(id, "ANIME").catch(() => null),
  ]);

  const credits = creditsRes?.data;

  // Extract lead director or lead producer from staff credits
  const leadDirector =
    credits?.staff?.find(
      (s) =>
        s.role?.toLowerCase() === "director" ||
        (s.role?.toLowerCase().includes("director") &&
          !s.role?.toLowerCase().includes("sound") &&
          !s.role?.toLowerCase().includes("assistant") &&
          !s.role?.toLowerCase().includes("art"))
    ) || credits?.staff?.find((s) => s.role?.toLowerCase().includes("producer"));

  // Fetch creative production personnel's other helmed anime works
  const directorStaffRes = leadDirector?.id
    ? await AnimeServiceV2.getStaffDetail(leadDirector.id).catch(() => null)
    : null;

  const seenWorkIds = new Set<number>();
  const productionWorks: ProductionWorkItem[] = [];
  if (directorStaffRes?.data?.staffMedia && Array.isArray(directorStaffRes.data.staffMedia)) {
    for (const item of directorStaffRes.data.staffMedia) {
      const node = item.node;
      if (
        node?.id &&
        node.id !== Number(id) &&
        node.type === "ANIME" &&
        !seenWorkIds.has(node.id)
      ) {
        seenWorkIds.add(node.id);
        productionWorks.push({
          id: node.id,
          idMal: node.idMal || node.id,
          title: node.title,
          coverImage: node.coverImage,
          bannerImage: node.bannerImage || "",
          genres: node.genres || [],
          tags: [],
          type: "ANIME",
          format: node.format || "TV",
          status: node.status || "FINISHED",
          episodes: node.episodes || null,
          duration: node.duration || null,
          averageScore: node.averageScore || 0,
          season: node.season || null,
          productionRole: item.staffRole || leadDirector?.role || "Production",
        });
      }
    }
  }

  const studios =
    credits?.studios && credits.studios.length > 0
      ? credits.studios
      : dataInfo.studios && dataInfo.studios.length > 0
      ? dataInfo.studios.map((s, idx) => ({
          id: idx + 1,
          name: s.name,
          isAnimationStudio: true,
          isMain: idx === 0,
        }))
      : [];

  return (
    <div className="pb-10">
      <Banner item={dataInfo} />
      <div className="px-4 sm:px-6 lg:px-10">
        <CardBanner item={dataInfo} />
        <InfoDetails item={dataInfo} />
        {credits && (credits.characters?.length > 0 || credits.staff?.length > 0) && (
          <AnimeVoiceActorsRack
            characters={credits.characters}
            staff={credits.staff}
            studios={credits.studios}
          />
        )}
        {(studios.length > 0 || leadDirector || productionWorks.length > 0) && (
          <AnimeProductionRack
            studios={studios}
            leadDirector={leadDirector}
            productionWorks={productionWorks}
            currentAnimeTitle={
              typeof dataInfo.title === "object"
                ? dataInfo.title.userPreferred || dataInfo.title.romaji || ""
                : dataInfo.title
            }
          />
        )}
        <RelatedGenreRack genres={dataInfo.genres} tags={dataInfo.tags} type="anime" />
        <Trailer trailer={dataInfo.trailer} />
        <Suspense fallback={<SkeletonEpisodes />}>
          <EpisodesContainer {...dataInfo} />
        </Suspense>
      </div>
      <div className="mt-4 flex flex-col gap-2 px-4 sm:px-0">
        <RelationComponent relation={dataInfo.relation} />
        {dataRecommendations.length > 0 && (
          <AnimeContainerCard
            animes={dataRecommendations}
            containerTitle="Curated Recommendations"
          />
        )}
      </div>
    </div>
  );
}

export default DetailPage;
