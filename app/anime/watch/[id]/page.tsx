import EpisodesComponent from '@/components/watch/episodes/EpisodesComponent';
import { Media } from '@/components/media/Media';
import { AnimeServiceV1 } from '@/services';
import { AnimeDetails, StreamInfo } from '@/types/anime.type';

type WatchPageParams = {
  params: { id: string };
  searchParams: { title: string; ep: number };
}

async function WatchPage({ params, searchParams }: WatchPageParams) {
  const { id } = params;
  const { title, ep } = searchParams;

  // Fetch the stream info (for video sources)
  const { data: dataStream }: { data: StreamInfo } = await AnimeServiceV1.getAnimeStream(`${id}`);
  // Fetch the anime details (for title, image, etc.)
  const { data: dataInfo }: { data: AnimeDetails } = await AnimeServiceV1.getAnimeInfoV1(`${title}`);

  return (
    <>
      <div className="flex flex-col gap-6 p-6 lg:flex-row">
        <Media title={dataInfo.title} poster={dataInfo.image} {...dataStream} />
        <EpisodesComponent item={dataInfo} ep={ep} />
      </div>

    </>
  );
}

export default WatchPage;

