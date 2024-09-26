// import { Suspense } from 'react';

import { Banner } from '@/components/detail/banner/Banner';
import CardBanner from '@/components/detail/cardbanner/CardBanner';
// import EpisodesContainer from '@/components/detail/episodes/EpisodesContainer';
// import RelationComponent from '@/components/detail/relation/RelationComponent';
import InfoDetails from '@/components/detail/infodetails/InfoDetails';
// import SkeletonEpisodes from '@/components/skeleton/SkeletonEpisodes';

import { MovieService } from '@/services';
import { TVInfo, Video } from '@/types/movies.type';
import Trailer from '@/components/media/Trailer';

async function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: dataInfo }: { data: TVInfo } = await MovieService.getTvById(id);
  const { data: { results: dataVideos } }: { data: { results: Video[] } } = await MovieService.getTVTrailer(id);
  const trailerVideo = dataVideos.find((video: Video) => (video.type.toLowerCase() === "trailer" || video.type.toLowerCase() === "trailer"))

  return (
    <>
      <div>
        <Banner item={dataInfo} />
        <div className="p-6">
          <CardBanner item={dataInfo} />
          <InfoDetails item={dataInfo} />
          {
            trailerVideo &&
            <Trailer trailer={trailerVideo} />
          }
          {/* <Suspense */}
          {/*   fallback={<SkeletonEpisodes />}> */}
          {/*   { */}
          {/*     (dataInfo.id_provider?.idGogo || dataInfo.id_provider?.idGogoDub) && */}
          {/*     <EpisodesContainer {...dataInfo} /> */}
          {/*   } */}
          {/* </Suspense> */}
          {/* <RelationComponent relation={dataInfo.relation} /> */}
        </div>
      </div>
    </>
  )
}

export default DetailPage;





