"use client";
import { useThemeStore } from "@/store/themeStore";
import { Routes } from "@/types/global";
import Link from "next/link"

type Episode = {
  epQuery: number;
  titleAndEpisode: string;
  episodeNumber: number;
  isSeries?: boolean;
  id: string;
  season?: number;
  ep?: number;
}

function EpisodeComponent({ id, titleAndEpisode, episodeNumber, epQuery, isSeries, season = 1, ep = 1 }: Episode) {
  const { theme } = useThemeStore();
  const determineRoutes = (): Routes | string => {
    if (isSeries) return `/series/watch/${id}/season/${season}/ep/${ep}`
    return { pathname: `/anime/watch/${id}`, query: { title: titleAndEpisode, ep: episodeNumber } };
  }

  const conditionEpisode = String(episodeNumber) === String(epQuery);
  return (
    <>
      <Link href={determineRoutes()}>
        <div className={`btn min-w-24 2xl:min-w-24 ${conditionEpisode ? `${theme === "garden" ? "bg-gray-700 text-white" : "bg-gray-600"}` : ""}`}>
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
