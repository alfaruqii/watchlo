"use client";

import Infos from './Infos';
import parse from 'html-react-parser';
import { useThemeStore } from '@/store/themeStore';
import { formatDesc, formatDuration, formatDate } from '@/utils/formatted';
import { MediaItem, getMediaType, isAnimeInfo, isMovieInfo, isTVInfo } from '@/utils/mediaTypeChecker';

type InfoDetailsProps = {
  item: MediaItem;
}

const InfoDetails: React.FC<InfoDetailsProps> = ({ item }) => {
  const { theme } = useThemeStore();
  const mediaType = getMediaType(item);

  const startDate = isAnimeInfo(item) && item.startIn
    ? formatDate(new Date(
      item.startIn.year ?? 0,
      (item.startIn.month ?? 1) - 1,
      item.startIn.day ?? 1
    ))
    : isTVInfo(item) ? formatDate(item.first_air_date) : 'unknown';

  const endDate = isAnimeInfo(item) && item.endIn
    ? formatDate(new Date(
      item.endIn.year ?? 0,
      (item.endIn.month ?? 1) - 1,
      item.endIn.day ?? 1
    ))
    : isTVInfo(item) ? formatDate(item.last_air_date) : 'unknown';


  const description = isAnimeInfo(item) ? item.description : item.overview ?? 'No description available';
  const status = item.status?.replace(/_/g, " ") ?? 'unknown';
  const score = isAnimeInfo(item) ? item.score?.decimalScore : item.vote_average ?? "unknown";
  const format = isAnimeInfo(item) ? item.format : mediaType;
  const duration = isAnimeInfo(item) ? item.duration : isMovieInfo(item) ? item.runtime : 0;
  const episodes = isAnimeInfo(item) ? `${item.episodes} Episodes` : isTVInfo(item) ? `${item.number_of_episodes} Episodes` : "unknown";
  const season = isAnimeInfo(item) ? item.season : isTVInfo(item) ? `${item.number_of_seasons} Seasons` : "?";
  const studios = isAnimeInfo(item) ? item.studios[0]?.name : item.production_companies[0]?.name ?? "unknown";

  const cleanSynopsis = formatDesc(description);
  const borderClass = theme === "black" ? "border-gray-200" : "border-gray-700";
  const scoreThemeClass = theme === "garden" ? "text-green-600" : "text-green-400";

  return (
    <div className="grid pt-10 sm:pt-20 sm:grid-cols-2 gap-2 sm:gap-4 sm:px-10">
      <div className={`sm:border-r sm:p-4 ${borderClass}`}>
        <div className="flex gap-1">
          <Infos topic="Average Score" value={score} customTheme={scoreThemeClass} />
          <p>/</p>
          <p>10</p>
        </div>
        <Infos topic="Status" value={status} />
        <Infos topic="Format" value={format.toUpperCase()} />
        {(mediaType === 'movie' || mediaType === 'anime') && (
          <Infos
            topic={mediaType === 'movie' ? "Duration" : "Average Episode Duration"}
            value={formatDuration(duration)}
          />
        )}
        {mediaType !== 'movie' && (
          <>
            <Infos topic="Total Episode" value={episodes} />
            <Infos topic="Start Date" value={startDate} />
            <Infos topic="End Date" value={endDate} />
            <Infos topic="Season" value={season} />
          </>
        )}
        <Infos topic="Studio" value={studios} customTheme="text-red-500 font-bold" />
      </div>
      <div>
        <p className={`border-b ${borderClass}`}>Synopsis</p>
        <p className="pt-1 text-justify text-balance text-sm">
          {parse(cleanSynopsis ?? "unknown")}
        </p>
      </div>
    </div>
  );
}

export default InfoDetails;
