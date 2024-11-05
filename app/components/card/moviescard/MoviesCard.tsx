import Link from "next/link";
import CardImage from "../chunk/CardImage";
import CardTitle from "../chunk/CardTitle";
import { MovieInfo, TVInfo } from "@/types/movies.type";
import SmallInfo from "@/components/detail/infodetails/SmallInfo";

interface MoviesCardProps {
  movie: MovieInfo | TVInfo;
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
          pathname: `/series/watch/${movie.id}`,
          query: { id: movie.id, season, ep },
        };
      return { pathname: `/movie/watch/${movie.id}`, query: { id: movie.id } };
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

  return (
    <>
      <Link href={determineRoutes(movie)}>
        <div
          key={movie.id}
          className="group relative transform transition-transform duration-300 ease-out group-hover:scale-105 group-hover:drop-shadow-xl"
        >
          <CardImage
            image={movie.poster_path ?? "/fallback-card.webp"}
            alt={determineTitle(movie) ?? "unknown"}
          />
          <CardTitle title={determineTitle(movie)} />
          <div className="">
            {"first_air_date" in movie ? (
              <SmallInfo
                year={new Date(movie.first_air_date).getFullYear().toString()}
                genre={movie.genre_names?.[0]}
                rating={String(movie?.vote_average?.toFixed(2))}
              />
            ) : (
              <SmallInfo
                year={new Date(movie.release_date).getFullYear().toString()}
                genre={movie.genre_names?.[0]}
                rating={String(movie?.vote_average?.toFixed(2))}
              />
            )}
          </div>
        </div>
      </Link>
    </>
  );
};
