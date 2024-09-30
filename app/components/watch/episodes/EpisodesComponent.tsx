import { AnimeDetails, AnimeEpisode } from "@/types/anime.type"
import EpisodeComponent from "./EpisodeComponent"
import { SeriesEpisode, TV } from "@/types/movies.type";
import { isAnimeDetails } from "@/utils/mediaTypeChecker";

interface Item {
  item: AnimeDetails | TV;
  ep: number;
  season?: number;
  id?: string;
}

function EpisodesComponent(data: Item) {
  return (
    <>
      <div className="flex flex-col pt-1.5 lg:max-w-[50%]">
        {
          isAnimeDetails(data.item) ?
            <p className="pb-1">
              Now Playing Episode {data.ep}
            </p> :
            <p className="pb-1">
              Now Playing (Season {data.season} - Episode {data.ep})
            </p>
        }
        <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full flex max-h-96 flex-wrap gap-2 overflow-y-scroll scrollbar scrollbar-track-gray-300 scrollbar-thumb-gray-800 2xl:max-h-[30rem] ">
          {
            isAnimeDetails(data.item) ?
              data.item.episodes.map((i: AnimeEpisode) => <EpisodeComponent key={i.id} id={i.id} titleAndEpisode={data.item.id as string} episodeNumber={i.number} epQuery={data.ep} />) :
              data.item.episodes.map((i: SeriesEpisode) => <EpisodeComponent key={i.id} id={String(data.id)} titleAndEpisode={data.item.id as string} episodeNumber={i.episode_number} epQuery={data.ep} isSeries season={i.season_number} ep={i.episode_number} />)
          }
        </div>
      </div>
    </>
  )
}

export default EpisodesComponent;
