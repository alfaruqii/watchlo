import Banner from "@/components/detail/banner/Banner";
import CardBanner from "@/components/detail/cardbanner/CardBanner";
import InfoDetails from "@/components/detail/infodetails/InfoDetails";
import CastAndCrewRack from "@/components/detail/credits/CastAndCrewRack";
import RelatedGenreRack from "@/components/detail/genre/RelatedGenreRack";
import Trailer from "@/components/media/Trailer";
import SeasonComponent from "@/components/season/SeasonComponent";
import { MoviesContainerCard } from "@/components/card/moviescard/MoviesContainterCard";

import { MovieService } from "@/services";

import fallbackTrailer from "@/utils/fallbackTrailer.json";
import { Review, TVInfo, Video, TMDBCreditsResponse, MovieInfo } from "@/types/movies.type";
import ReviewsComponent from "@/components/reviews/ReviewsComponent";

export const revalidate = 3600; // Cache on edge for 1 hour

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
    dataCreditsRes,
    dataRecsRes,
    dataSimilarRes,
  ]: [
    { data: TVInfo },
    { data: { results: Video[] } },
    { data: { results: Review[] } },
    { data: TMDBCreditsResponse } | null,
    { data: { results?: MovieInfo[] } } | null,
    { data: { results?: MovieInfo[] } } | null,
  ] = await Promise.all([
    MovieService.getTvById(id),
    MovieService.getTvTrailer(id),
    MovieService.getTvReviews(id),
    MovieService.getTvCredits(id).catch(() => null),
    MovieService.getTvRecommendations(id).catch(() => null),
    MovieService.getTvSimilar(id).catch(() => null),
  ]);

  const credits = dataCreditsRes?.data ?? { cast: [], crew: [] };
  const recommendedSeries = dataRecsRes?.data?.results ?? [];
  const similarSeries = dataSimilarRes?.data?.results ?? [];

  const trailerVideo =
    dataVideos.find((video: Video) => video.type.toLowerCase() === "trailer") ??
    dataVideos.find(
      (video: Video) =>
        video.type.toLowerCase() === "opening credits" &&
        video.site.toLowerCase() === "youtube"
    );
  const trailerFallback: Video = fallbackTrailer;

  return (
    <div className="pb-10">
      <Banner item={dataInfo} />
      <div className="px-4 sm:px-6 lg:px-10">
        <CardBanner item={dataInfo} />
        <InfoDetails item={dataInfo} />
        {credits.cast.length > 0 && (
          <CastAndCrewRack
            cast={credits.cast}
            crew={credits.crew}
            title="Ensemble Cast & Series Personnel"
          />
        )}
        <RelatedGenreRack genres={dataInfo.genres} type="series" />
        <div className="my-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Trailer trailer={trailerVideo ?? trailerFallback} />
          <SeasonComponent data={dataInfo} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 px-4 sm:px-0">
        {recommendedSeries.length > 0 && (
          <MoviesContainerCard
            containerTitle="Curated Series Recommendations"
            movies={recommendedSeries}
          />
        )}
        {similarSeries.length > 0 && (
          <MoviesContainerCard
            containerTitle="Similar Archival Broadcasts"
            movies={similarSeries}
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
