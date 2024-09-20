"use client";
import Infos from './Infos'
import parse from 'html-react-parser';
import { AnimeInfo } from '@/types/anime.type'
import { useThemeStore } from '@/store/themeStore';

function InfoDetails({ description, status, score, episodes, duration, format, studios, season, startIn, endIn }: AnimeInfo) {
  const { theme } = useThemeStore();

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const startDate = startIn && startIn.year && startIn.month && startIn.day
    ? new Date(startIn.year, startIn.month - 1, startIn.day).toLocaleDateString("en-US", dateOptions)
    : 'Unknown';

  const endDate = endIn && endIn.year && endIn.month && endIn.day
    ? new Date(endIn.year, endIn.month - 1, endIn.day).toLocaleDateString("en-US", dateOptions)
    : 'Unknown';


  const cleanSynopsis = description
    ?.replace(/<br\s*\/?>/gi, '')
    .replace(/\(Source:.*?\)/g, '')
    .trim();
  const formattedStatus = status.replace(/_/g, " ");
  return (
    <>
      <div className="grid pt-14 sm:pt-20 sm:grid-cols-2 gap-2 sm:gap-4 sm:px-10">
        <div className={`sm:border-r sm:p-4 ${theme === "black" ? "border-gray-200" : "border-gray-700"} `}>
          <div className="flex gap-1">
            <Infos topic="Average Score" value={score.decimalScore ?? "unknown"} customTheme={`${theme === "garden" ? "text-green-600" : "text-green-400"}`} />
            <p>/</p>
            <p>10</p>
          </div>
          <Infos topic="Status" value={formattedStatus} />
          <Infos topic="Format" value={format} />
          <Infos topic="Average Episode Duration" value={`${duration ?? "?"} minutes`} />
          <Infos topic="Total Episode" value={episodes} />
          <Infos topic="Start Date" value={startDate} />
          <Infos topic="End Date" value={endDate} />
          <Infos topic="Season" value={season} />
          <Infos topic="Studio" value={studios[0]?.name} customTheme="text-red-500 font-bold" />
        </div>
        <div>
          <p className={`border-b ${theme === "black" ? "border-gray-200" : "border-gray-700"} `}>
            Synopsis
          </p>
          <p className="pt-1 text-justify text-balance text-sm">
            {parse(cleanSynopsis)}
          </p>
        </div>
      </div >
    </>
  )
}

export default InfoDetails
