import EpisodesComponent from '@/components/watch/episodes/EpisodesComponent';
import Embeded from '@/components/media/Embeded';
import { TV } from '@/types/movies.type';
import { MovieService } from '@/services';

type WatchPageParams = {
  params: { id: string, season: number };
  searchParams: { animeTitle: string; ep: string };
}

async function WatchPage({ params, searchParams }: WatchPageParams) {
  const { id, season } = params;
  const { data: tvInfo }: { data: TV } = await MovieService.getTvSeason(id, season);

  // Fetch the stream info (for video sources)
  return (
    <>
      <div className="flex flex-col gap-6 p-6 lg:flex-row">
        <Embeded type="tv" id={id} />
        <EpisodesComponent {...tvInfo} />
      </div>

    </>
  );
}

export default WatchPage;


