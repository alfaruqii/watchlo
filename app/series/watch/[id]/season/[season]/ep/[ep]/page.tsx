import EpisodesComponent from '@/components/watch/episodes/EpisodesComponent';
import { TV } from '@/types/movies.type';
import { MovieService } from '@/services';
import Embeded from '@/components/media/Embeded';

type WatchPageParams = {
  params: { id: string, ep: number, season: number };
}

async function WatchPage({ params }: WatchPageParams) {
  const { id, season, ep }: { id: string; ep: number; season: number } = params;
  const { data: tvInfo }: { data: TV } = await MovieService.getTvSeason(id, season);

  // Fetch the stream info (for video sources)
  return (
    <>
      <div className="flex flex-col gap-6 p-6 lg:flex-row">
        <Embeded id={id} type="tv" season={season} ep={ep} />
        <EpisodesComponent item={tvInfo} id={id} ep={ep} season={season} />
      </div>

    </>
  );
}

export default WatchPage;




