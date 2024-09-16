import { AnimeInfo, Episode } from "@/app/types/anime.type"
import EpisodeComponent from "./EpisodeComponent"

function EpisodesComponent(anime: AnimeInfo) {
  return (
    <>
      <div className="grid grid-cols-4">
        {
          anime.episodes.map((i: Episode) => <EpisodeComponent id={i.id} episode={anime.id as string} episodeNumber={i.number} />)
        }
      </div>
    </>
  )
}

export default EpisodesComponent;
