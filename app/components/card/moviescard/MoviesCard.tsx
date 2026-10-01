import Link from "next/link";
import CardImage from "../chunk/CardImage";
import CardTitle from "../chunk/CardTitle";
import { MovieInfo, TVInfo } from "@/types/movies.type";
import SmallInfo from "@/components/detail/infodetails/SmallInfo";

interface MoviesCardProps {
  movie: MovieInfo | TVInfo;
  spineIndex?: number;
  isDetail?: boolean;
  season?: number;
  ep?: number;
}

interface Routes {
  pathname: string;
  query: {
    id: string | number;
    season?: number;
    ep?: number;
  };
}

export const MoviesCard = ({
  movie,
  spineIndex,
  isDetail,
  season,
  ep,
}: MoviesCardProps) => {
  const isSeries = (movie: TVInfo): movie is TVInfo =>
    "first_air_date" in movie;

  const determineRoutes = (movie: MovieInfo | TVInfo): Routes | string => {
    if (!isDetail) {
      if (isSeries(movie as TVInfo))
        return {
          pathname: `/series/watch`,
          query: { id: movie.id, season, ep },
        };
      return `/movie/detail/${movie.id}`;
    }
    if (isSeries(movie as TVInfo)) return `/series/detail/${movie.id}`;
    return `/movie/detail/${movie.id}`;
  };

  const determineTitle = (movie: MovieInfo | TVInfo): string => {
    if ("first_air_date" in movie) {
      return movie.name;
    }
    return movie.title;
  };

  const spineCode =
    typeof spineIndex === "number"
      ? `SPINE #${String(spineIndex + 1).padStart(2, "0")}`
      : `CAT #${movie.id}`;

  const mediaFormat = "first_air_date" in movie ? "SERIES" : "FILM";

  return (
    <Link
      href={determineRoutes(movie)}
      className="block w-[164px] shrink-0 sm:w-[228px]"
    >
      <div
        key={movie.id}
        className="group relative flex w-full flex-col rounded-sm border border-hairline bg-surface-1 p-2.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold hover:bg-surface-2 hover:z-10 hover:shadow-sleeve"
      >
        {/* Top Collector Spine Strip */}
        <div className="mb-1.5 flex items-center justify-between gap-1 border-b border-hairline/80 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums">
          <span className="shrink-0 whitespace-nowrap font-semibold text-gold">{spineCode}</span>
          <span className="shrink-0 whitespace-nowrap">{mediaFormat}</span>
        </div>

        <CardImage
          image={movie.poster_path ?? "/fallback-card.webp"}
          alt={determineTitle(movie) ?? "unknown"}
        />
        <CardTitle title={determineTitle(movie)} />
        <div className="w-full">
          {"first_air_date" in movie ? (
            <SmallInfo
              year={new Date(movie.first_air_date).getFullYear().toString()}
              genre={movie.genre_names?.[0]}
              rating={String(movie?.vote_average?.toFixed(1))}
            />
          ) : (
            <SmallInfo
              year={new Date(movie.release_date).getFullYear().toString()}
              genre={movie.genre_names?.[0]}
              rating={String(movie?.vote_average?.toFixed(1))}
            />
          )}
        </div>
      </div>
    </Link>
  );
};
