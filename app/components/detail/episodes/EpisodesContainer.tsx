import { AnimeServiceV1 } from "@/services";
import { AnimeDetails, AnimeInfo } from "@/types/anime.type"
import { AnimeCardDetail } from "../card/AnimeCardDetail";

async function EpisodesContainer(anime: AnimeInfo) {
  const { data: dataV1Info }: { data: AnimeDetails } = await AnimeServiceV1.getAnimeInfoV1(anime?.id_provider?.idGogo);
  return (
    <>
      <div className="py-4 overflow-hidden">
        <div className="flex embla__container gap-4 relative w-full overflow-x-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-800 scrollbar-track-gray-300 pb-2">
          {
            dataV1Info.episodes.map((episode) =>
              <AnimeCardDetail key={episode.id} animeImage={dataV1Info.image} id={dataV1Info.id} episodeNumber={episode.number} episodeId={episode.id} />
            )
          }
        </div>
      </div>
    </>
  )
}

export default EpisodesContainer;
