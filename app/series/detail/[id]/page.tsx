import Banner from "@/components/detail/banner/Banner";
import CardBanner from "@/components/detail/cardbanner/CardBanner";
import InfoDetails from "@/components/detail/infodetails/InfoDetails";
import Trailer from "@/components/media/Trailer";
import SeasonComponent from "@/components/season/SeasonComponent";

import { MovieService } from "@/services";

import fallbackTrailer from "@/utils/fallbackTrailer.json";
import { Review, TVInfo, Video } from "@/types/movies.type";
import ReviewsComponent from "@/components/reviews/ReviewsComponent";

async function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: dataInfo }: { data: TVInfo } = await MovieService.getTvById(id);
  const {
    data: { results: dataVideos },
  }: { data: { results: Video[] } } = await MovieService.getTvTrailer(id);
  const {
    data: { results: dataReviews },
  }: { data: { results: Review[] } } = await MovieService.getTvReviews(id);
  const trailerVideo =
    dataVideos.find((video: Video) => video.type.toLowerCase() === "trailer") ??
    dataVideos.find(
      (video: Video) =>
        video.type.toLowerCase() === "opening credits" &&
        video.site.toLowerCase() === "youtube"
    );
  const trailerFallback: Video = fallbackTrailer;

  return (
    <>
      <div>
        <Banner item={dataInfo} />
        <div className="p-6">
          <CardBanner item={dataInfo} />
          <InfoDetails item={dataInfo} />
          <div className="lg:grid grid-cols-2 gap-4">
            <Trailer trailer={trailerVideo ?? trailerFallback} />
            <SeasonComponent data={dataInfo} />
          </div>
          {dataReviews.length > 0 && <ReviewsComponent reviews={dataReviews} />}
        </div>
      </div>
    </>
  );
}

export default DetailPage;
