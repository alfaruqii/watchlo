import { Suspense } from 'react';

import { Banner } from '@/components/detail/banner/Banner';
import CardBanner from '@/components/detail/cardbanner/CardBanner';
import EpisodesContainer from '@/components/detail/episodes/EpisodesContainer';
import RelationComponent from '@/components/detail/relation/RelationComponent';
import InfoDetails from '@/components/detail/infodetails/InfoDetails';
import Trailer from '@/components/media/Trailer';
import SkeletonEpisodes from '@/components/skeleton/SkeletonEpisodes';

import { AnimeServiceV2 } from '@/services';
import { AnimeInfo } from '@/types/anime.type';

async function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: dataInfo }: { data: AnimeInfo } = await AnimeServiceV2.getAnimeInfoV2(id);

  return (
    <>
      <div>
        <Banner item={dataInfo} />
        <div className="p-6">
          <CardBanner item={dataInfo} />
          <InfoDetails item={dataInfo} />
          <Trailer trailer={dataInfo.trailer} />
          <Suspense
            fallback={<SkeletonEpisodes />}>
            {
              (dataInfo.id_provider?.idGogo || dataInfo.id_provider?.idGogoDub) &&
              <EpisodesContainer {...dataInfo} />
            }
          </Suspense>
          <RelationComponent relation={dataInfo.relation} />
        </div>
      </div>
    </>
  )
}

export default DetailPage;
