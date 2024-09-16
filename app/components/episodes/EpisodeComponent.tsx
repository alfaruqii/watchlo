import { AnimeDetails } from "@/app/types/anime.type"
import Link from "next/link"

type Episode = {
  id: string;
  episode: string;
  episodeNumber: number;
}

function EpisodeComponent({ id, episode, episodeNumber }: Episode) {
  const route = { pathname: `/anime/watch/${id}`, query: { animeId: episode, ep: episodeNumber } }
  return (
    <>
      <Link href={route}>
        <div className="btn">
          {
            episode
          }
        </div>
      </Link>
    </>
  )
}

export default EpisodeComponent;
