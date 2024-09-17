// /anime/watch/[id]/page.tsx
import EpisodesComponent from '@/app/components/episodes/EpisodesComponent';
import { Media } from '@/app/components/media/Media';
import { AnimeServiceV1 } from '@/app/services';
import { AnimeDetails, StreamInfo } from '@/app/types/anime.type';

type WatchPageParams = {
  params: { id: string };
  searchParams: { animeTitle: string; ep: string };
}

async function WatchPage({ params, searchParams }: WatchPageParams) {
  const { id } = params;
  const { animeTitle, ep } = searchParams;

  // Fetch the stream info (for video sources)
  const { data: dataStream }: { data: StreamInfo } = await AnimeServiceV1.getAnimeStream(`${id}`);
  // Fetch the anime details (for title, image, etc.)
  const { data: dataInfo }: { data: AnimeDetails } = await AnimeServiceV1.getAnimeInfoV1(`${animeTitle}`);

  return (
    <>
      <div className="flex flex-col gap-6 p-6 lg:flex-row">
        <Media title={dataInfo.title} poster={dataInfo.image} {...dataStream} />
        <EpisodesComponent {...dataInfo} ep={ep} />
      </div>

    </>
  );
}

export default WatchPage;

