import { Disc } from "lucide-react";
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
  isAnime?: boolean;
  handleEpisodeChange?: (ep: string) => void;
}

function EpisodesComponent({
  item,
  ep,
  season,
  id,
  isDub,
  isAnime: explicitIsAnime,
  handleEpisodeChange,
}: Item) {
  const isAnime = explicitIsAnime ?? (season === undefined || isAnimeDetails(item));

  const episodes = isAnime
    ? (item as AnimeDetails)?.episodes ?? []
    : (item as TV)?.episodes ?? [];

  return (
    <aside className="col-span-2 flex flex-col rounded-sm border border-hairline bg-surface-1 p-4 sm:p-5">
      <div className="mb-3.5 flex items-center justify-between gap-2 border-b border-hairline pb-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Disc className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
          <p className="truncate font-display text-sm font-bold text-foreground sm:text-base">
            {isAnime || !season
              ? `Now Playing · Ep ${ep}`
              : `Season ${season} · Episode ${ep}`}
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-sm border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-bold text-gold tabular-nums sm:text-[11px]">
          {episodes?.length ?? 0} REELS
        </span>
      </div>

      <div className="grid max-h-96 grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5">
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
    </aside>
  );
}

export default EpisodesComponent;
