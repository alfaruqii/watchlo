import { Suspense } from "react";

import Banner from "@/components/detail/banner/Banner";
import CardBanner from "@/components/detail/cardbanner/CardBanner";
import InfoDetails from "@/components/detail/infodetails/InfoDetails";
import SkeletonEpisodes from "@/components/skeleton/SkeletonEpisodes";

import { MovieService } from "@/services";
import { MovieInfo, Review, Video } from "@/types/movies.type";
import Trailer from "@/components/media/Trailer";
import Embeded from "@/components/media/Embeded";
import ReviewsComponent from "@/components/reviews/ReviewsComponent";
import { MoviesContainerCard } from "@/components/card/moviescard/MoviesContainterCard";

async function DetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const { data: dataInfo }: { data: MovieInfo } =
    await MovieService.getMoviesById(id);
  const {
    data: { results: dataVideos },
  }: { data: { results: Video[] } } = await MovieService.getMovieTrailer(id);
  const {
    data: { results: dataReviews },
  }: { data: { results: Review[] } } = await MovieService.getMovieReviews(id);
  const { data: dataMovieSimilar } = await MovieService.getMovieSimilar(id);
  const { data: dataMovieRecommendations } =
    await MovieService.getMovieRecommendations(id);
  const trailerVideo = dataVideos.find(
    (video: Video) =>
      video.type.toLowerCase() === "trailer" ||
      video.type.toLowerCase() === "trailer"
  );

  return (
    <>
      <div>
        <Banner item={dataInfo} />
        <div className="p-6">
          <CardBanner item={dataInfo} />
          <InfoDetails item={dataInfo} />
          <div className="lg:grid gap-4 grid-cols-2">
            {trailerVideo && <Trailer trailer={trailerVideo} />}
            <Suspense fallback={<SkeletonEpisodes />}>
              <Embeded type="movie" id={id} />
            </Suspense>
          </div>
          <div className="mt-10 flex flex-col gap-4">
            {dataMovieRecommendations.length > 0 && (
              <MoviesContainerCard
                containerTitle="Recommendations 👌"
                movies={dataMovieRecommendations.results}
              />
            )}
            {dataMovieSimilar.length > 0 && (
              <MoviesContainerCard
                containerTitle="Similar 📍"
                movies={dataMovieSimilar.results}
              />
            )}
          </div>
          {dataReviews.length > 0 && <ReviewsComponent reviews={dataReviews} />}
        </div>
      </div>
    </>
  );
}

export default DetailPage;
