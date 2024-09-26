import { Suspense } from 'react';

import { Banner } from '@/components/detail/banner/Banner';
import CardBanner from '@/components/detail/cardbanner/CardBanner';
import InfoDetails from '@/components/detail/infodetails/InfoDetails';
import SkeletonEpisodes from '@/components/skeleton/SkeletonEpisodes';

import { MovieService } from '@/services';
import { MovieInfo, Video } from '@/types/movies.type';
import Trailer from '@/components/media/Trailer';
import Embeded from '@/components/media/Embeded';

async function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: dataInfo }: { data: MovieInfo } = await MovieService.getMoviesById(id);
  const { data: { results: dataVideos } }: { data: { results: Video[] } } = await MovieService.getMovieTrailer(id);
  const trailerVideo = dataVideos.find((video: Video) => (video.type.toLowerCase() === "trailer" || video.type.toLowerCase() === "trailer"))

  return (
    <>
      <div>
        <Banner item={dataInfo} />
        <div className="p-6">
          <CardBanner item={dataInfo} />
          <InfoDetails item={dataInfo} />
          <div className="lg:grid gap-4 grid-cols-2">
            {
              trailerVideo &&
              <Trailer trailer={trailerVideo} />
            }
            <Suspense
              fallback={<SkeletonEpisodes />}>
              <Embeded type="movie" id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailPage;



