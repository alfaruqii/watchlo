import { AnimeDetails, AnimeEpisode } from "@/types/anime.type";
import { SeriesEpisode, TV } from "@/types/movies.type";
import { isAnimeDetails } from "@/utils/mediaTypeChecker";
import EpisodeComponent from "./EpisodeComponent";

interface Item {
  item: AnimeDetails | TV;
  ep: string;
  season?: string;
  id?: string;
  isDub?: string;
  handleEpisodeChange?: (ep: string) => void;
}

function EpisodesComponent({
  item,
  ep,
  season,
  id,
  isDub,
  handleEpisodeChange,
}: Item) {
  const isAnime = isAnimeDetails(item);

  const episodes = isAnime
    ? (item as AnimeDetails).episodes
    : (item as TV).episodes;

  return (
    <div className="flex flex-col pt-1.5 col-span-2">
      <p className="pb-1">
        {isAnime
          ? `Now Playing Episode ${ep}`
          : `Now Playing (Season ${season} - Episode ${ep})`}
      </p>
      <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-96 overflow-y-auto scrollbar scrollbar-track-gray-300 scrollbar-thumb-gray-800">
        {episodes.map((episode: AnimeEpisode | SeriesEpisode) => (
          <EpisodeComponent
            key={episode.id}
            isDub={isDub}
            episode={episode}
            isAnime={isAnime}
            id={String(id)}
            season={season}
            ep={ep}
            handleEpisodeChange={handleEpisodeChange}
          />
        ))}
      </div>
    </div>
  );
}

export default EpisodesComponent;
