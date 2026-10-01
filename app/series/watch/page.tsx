import Link from "next/link";
import { Film } from "lucide-react";
import EpisodesComponent from "@/components/watch/episodes/EpisodesComponent";
import { TV } from "@/types/movies.type";
import { MovieService } from "@/services";
import Embeded from "@/components/media/Embeded";

type WatchPageParams = {
  searchParams: Promise<{ id: string; ep: string; season: string }>;
};

async function WatchPage(props: WatchPageParams) {
  const searchParams = await props.searchParams;
  const { id, season, ep }: { id: string; ep: string; season: string } =
    searchParams;
  const { data: tvInfo }: { data: TV } = await MovieService.getTvSeason(
    id,
    season
  );

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
      <header className="flex items-center justify-between gap-2 rounded-sm border border-hairline bg-surface-1 px-3 py-2.5 sm:px-4 sm:py-3 shadow-xs">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 font-mono text-xs sm:gap-2">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-gold"
          >
            SERIES
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="truncate font-bold text-foreground max-w-[140px] sm:max-w-[320px]">
            {tvInfo?.name || `Season ${season}`}
          </span>
          <span className="shrink-0 rounded-xs border border-gold/40 bg-gold/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gold tabular-nums sm:px-2 sm:text-xs">
            S{String(season).padStart(2, "0")}·E{String(ep).padStart(2, "0")}
          </span>
        </div>

        <Link
          href={`/series/detail/${id}`}
          className="flex h-7 shrink-0 items-center gap-1 rounded-sm border border-hairline bg-surface-2 px-2.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold/60 hover:text-gold"
        >
          <Film className="size-3 shrink-0 text-gold" />
          <span>Series Dossier</span>
        </Link>
      </header>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5">
        <Embeded id={id} type="tv" season={season} ep={ep} />
        <EpisodesComponent
          item={tvInfo}
          id={id}
          ep={ep}
          season={season}
          isAnime={false}
        />
      </div>
    </div>
  );
}

export default WatchPage;
