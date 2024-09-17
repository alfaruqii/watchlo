"use client";
import { useThemeStore } from "@/app/store/themeStore";
import Link from "next/link"

type Episode = {
  id: string;
  epQuery: string;
  titleAndEpisode: string;
  episodeNumber: number;
}

function EpisodeComponent({ id, titleAndEpisode, episodeNumber, epQuery }: Episode) {
  const { theme } = useThemeStore();
  const route = { pathname: `/anime/watch/${id}`, query: { animeTitle: titleAndEpisode, ep: episodeNumber } }

  const conditionEpisode = String(episodeNumber) === epQuery;
  return (
    <>
      <Link href={route}>
        <div className={`btn min-w-16 2xl:min-w-24 ${conditionEpisode ? `${theme === "garden" ? "bg-gray-700 text-white" : "bg-gray-600"}` : ""}`}>
          <p>
            {
              episodeNumber
            }
          </p>
        </div>
      </Link>
    </>
  )
}

export default EpisodeComponent;
