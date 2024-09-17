"use client";
import { AnimeDetails, Episode } from "@/app/types/anime.type"
import EpisodeComponent from "./EpisodeComponent"

interface Anime extends AnimeDetails {
  ep: string
}

function EpisodesComponent(anime: Anime) {
  return (
    <>
      <div className="lg:max-w-[50%] flex flex-col pt-1.5">
        <p className="pb-1">
          Now Playing Episode {anime.ep}
        </p>
        <div className="flex flex-wrap gap-2 scrollbar scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-800 scrollbar-track-gray-300 max-h-96 2xl:max-h-[30rem] overflow-y-scroll ">
          {
            anime.episodes.map((i: Episode) => <EpisodeComponent id={i.id} titleAndEpisode={anime.id as string} episodeNumber={i.number} epQuery={anime.ep} />)
          }
        </div>
      </div>
    </>
  )
}

export default EpisodesComponent;
