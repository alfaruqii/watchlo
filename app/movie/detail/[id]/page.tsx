import { Suspense } from "react";

import Banner from "@/components/detail/banner/Banner";
import CardBanner from "@/components/detail/cardbanner/CardBanner";
import InfoDetails from "@/components/detail/infodetails/InfoDetails";
import CastAndCrewRack from "@/components/detail/credits/CastAndCrewRack";
import RelatedGenreRack from "@/components/detail/genre/RelatedGenreRack";
import { MovieService } from "@/services";
import { MovieInfo, Review, Video, TMDBCreditsResponse } from "@/types/movies.type";
import Trailer from "@/components/media/Trailer";
import Embeded from "@/components/media/Embeded";
import ReviewsComponent from "@/components/reviews/ReviewsComponent";
import { MoviesContainerCard } from "@/components/card/moviescard/MoviesContainterCard";

async function DetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const [
    { data: dataInfo },
    {
      data: { results: dataVideos },
    },
    {
      data: { results: dataReviews },
    },
    { data: dataMovieSimilar },
    { data: dataMovieRecommendations },
    dataCreditsRes,
  ]: [
    { data: MovieInfo },
    { data: { results: Video[] } },
    { data: { results: Review[] } },
    { data: { results?: MovieInfo[] } },
    { data: { results?: MovieInfo[] } },
    { data: TMDBCreditsResponse } | null,
  ] = await Promise.all([
    MovieService.getMoviesById(id),
    MovieService.getMovieTrailer(id),
    MovieService.getMovieReviews(id),
    MovieService.getMovieSimilar(id),
    MovieService.getMovieRecommendations(id),
    MovieService.getMovieCredits(id).catch(() => null),
  ]);
  const similarMovies = dataMovieSimilar?.results ?? [];
  const recommendedMovies = dataMovieRecommendations?.results ?? [];
  const credits = dataCreditsRes?.data ?? { cast: [], crew: [] };
  const trailerVideo = dataVideos.find(
    (video: Video) =>
      video.type.toLowerCase() === "trailer" ||
      video.type.toLowerCase() === "teaser"
  );

  return (
    <div className="pb-10">
      <Banner item={dataInfo} />
      <div className="px-4 sm:px-6 lg:px-10">
        <CardBanner item={dataInfo} />
        <InfoDetails item={dataInfo} />
        {credits.cast.length > 0 && (
          <CastAndCrewRack cast={credits.cast} crew={credits.crew} />
        )}
        <RelatedGenreRack genres={dataInfo.genres} type="movie" />
        <div className="my-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {trailerVideo && <Trailer trailer={trailerVideo} />}
          <Suspense
            fallback={
              <div className="aspect-video w-full rounded-sm border border-hairline bg-surface-2 animate-pulse" />
            }
          >
            <Embeded
              type="movie"
              id={id}
              title={dataInfo.title}
              imdbId={dataInfo.imdb_id}
            />
          </Suspense>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 px-4 sm:px-0">
        {recommendedMovies.length > 0 && (
          <MoviesContainerCard
            containerTitle="Curated Recommendations"
            movies={recommendedMovies}
          />
        )}
        {similarMovies.length > 0 && (
          <MoviesContainerCard
            containerTitle="Similar Archival Editions"
            movies={similarMovies}
          />
        )}
      </div>

      <div className="px-4 sm:px-6 lg:px-10">
        {dataReviews.length > 0 && <ReviewsComponent reviews={dataReviews} />}
      </div>
    </div>
  );
}

export default DetailPage;
