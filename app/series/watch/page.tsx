import EpisodesComponent from "@/components/watch/episodes/EpisodesComponent";
import { TV } from "@/types/movies.type";
import { MovieService } from "@/services";
import Embeded from "@/components/media/Embeded";

type WatchPageParams = {
  searchParams: Promise<{ id: string; ep: string; season: string }>;
};

async function WatchPage(props: WatchPageParams) {
  const searchParams = await props.searchParams;
  const { id, season, ep }: { id: string; ep: string; season: string } =
    searchParams;
  const { data: tvInfo }: { data: TV } = await MovieService.getTvSeason(
    id,
    season
  );

  // Fetch the stream info (for video sources)
  return (
    <>
      <div className="flex flex-col gap-6 p-6 lg:grid lg:grid-cols-5">
        <Embeded id={id} type="tv" season={season} ep={ep} />
        <EpisodesComponent item={tvInfo} id={id} ep={ep} season={season} />
      </div>
    </>
  );
}

export default WatchPage;
