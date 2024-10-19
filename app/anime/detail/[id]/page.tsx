import { Suspense } from "react";

import { Banner } from "@/components/detail/banner/Banner";
import CardBanner from "@/components/detail/cardbanner/CardBanner";
import EpisodesContainer from "@/components/detail/episodes/EpisodesContainer";
import RelationComponent from "@/components/detail/relation/RelationComponent";
import InfoDetails from "@/components/detail/infodetails/InfoDetails";
import Trailer from "@/components/media/Trailer";
import SkeletonEpisodes from "@/components/skeleton/SkeletonEpisodes";

import { AnimeServiceV2 } from "@/services";
import { AnimeInfo, RelationOrRecommendation } from "@/types/anime.type";
import { AnimeContainerCard } from "@/components/card/animecard/AnimeContainerCard";

async function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: dataInfo }: { data: AnimeInfo } =
    await AnimeServiceV2.getAnimeInfoV2(id);
  const {
    data: { results: dataRecommendations },
  }: { data: { results: RelationOrRecommendation[] } } =
    await AnimeServiceV2.getRecommendationAnime(id);

  return (
    <>
      <div>
        <Banner item={dataInfo} />
        <div className="p-6">
          <CardBanner item={dataInfo} />
          <InfoDetails item={dataInfo} />
          <Trailer trailer={dataInfo.trailer} />
          <Suspense fallback={<SkeletonEpisodes />}>
            {(dataInfo.id_provider?.idGogo ||
              dataInfo.id_provider?.idGogoDub) && (
              <EpisodesContainer {...dataInfo} />
            )}
          </Suspense>
          <div className="flex flex-col gap-4">
            <RelationComponent relation={dataInfo.relation} />
            {dataRecommendations.length > 0 && (
              <AnimeContainerCard
                animes={dataRecommendations}
                containerTitle="Recommendations 👌"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailPage;
