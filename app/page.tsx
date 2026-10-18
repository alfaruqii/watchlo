import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Play, Star, Award } from "lucide-react";
import { MoviesContainerCard } from "./components/card/moviescard/MoviesContainterCard";
import HeroMediaCarousel from "./components/hero/HeroMediaCarousel";
import { MovieService } from "./services";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import GenreFilter from "./components/genre/GenreFilter";
import GenreFilterFallback from "./components/genre/GenreFilterFallback";
import GenreShelf from "./components/genre/GenreShelf";

export const revalidate = 300; // Cache on edge for 5 minutes

export default async function Home() {
  const [
    popularSettled,
    topRatedSettled,
    trendingSettled,
    tvTopRatedSettled,
    tvTrendingSettled,
  ] = await Promise.allSettled([
    MovieService.getMoviesPopular(),
    MovieService.getMoviesTopRated(),
    MovieService.getMoviesTrending(),
    MovieService.getTvTopRated(),
    MovieService.getTvTrending(),
  ]);

  const dataMoviesPopular =
    popularSettled.status === "fulfilled"
      ? popularSettled.value.data
      : { results: [] };
  const dataMoviesTopRated =
    topRatedSettled.status === "fulfilled"
      ? topRatedSettled.value.data
      : { results: [] };
  const dataMoviesTrending =
    trendingSettled.status === "fulfilled"
      ? trendingSettled.value.data
      : { results: [] };
  const dataTvTopRated =
    tvTopRatedSettled.status === "fulfilled"
      ? tvTopRatedSettled.value.data
      : { results: [] };
  const dataTvTrending =
    tvTrendingSettled.status === "fulfilled"
      ? tvTrendingSettled.value.data
      : { results: [] };

  const curatorPick = dataMoviesTopRated?.results?.[0];

  // Aggregate pool for client-side genre filtering (deduplicated in GenreShelf)
  const genrePool = [
    ...(dataMoviesPopular.results || []),
    ...(dataMoviesTrending.results || []),
    ...(dataMoviesTopRated.results || []),
    ...(dataTvTrending.results || []),
    ...(dataTvTopRated.results || []),
  ];

  return (
    <div className="flex min-h-fit flex-col pb-8">
      <HeroMediaCarousel items={dataMoviesPopular.results} />

      <Suspense fallback={<GenreFilterFallback />}>
        <GenreFilter mediaType="movie" />
      </Suspense>

      {/* Filtered Genre Shelf if active */}
      <Suspense fallback={null}>
        <GenreShelf pool={genrePool} />
      </Suspense>

      <div className="px-4 sm:px-0">
        <MoviesContainerCard
          containerTitle="Critics' Vault — Top Rated Films"
          movies={dataMoviesTopRated.results}
        />
      </div>

      <div className="px-4 sm:px-0">
        <MoviesContainerCard
          containerTitle="Current Screening — Trending Films"
          movies={dataMoviesTrending.results}
        />
      </div>

      {/* Repertory Intermission Spotlight Plate (Pacing variation between Film & Series rails) */}
      {curatorPick && (
        <section
          aria-label="Archival Curator Spotlight"
          className="mx-4 my-8 overflow-hidden rounded-sm border border-hairline bg-surface-1 sm:mx-6 lg:mx-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="order-2 flex flex-col justify-between p-4 sm:p-6 md:order-1 md:col-span-6 md:border-r md:border-hairline lg:p-8">
              <div className="flex flex-col gap-3">
                <h2 className="text-balance font-display text-xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {curatorPick.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums">
                  <Badge variant="default" className="gap-1">
                    <Award className="size-3" strokeWidth={2} />
                    ARCHIVE #01 RATED
                  </Badge>
                  <span>
                    {curatorPick.release_date
                      ? new Date(curatorPick.release_date).getFullYear()
                      : "CLASSIC"}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-gold">
                    <Star className="size-3 fill-gold text-gold" />
                    {curatorPick.vote_average?.toFixed(2)} / 10
                  </span>
                  {curatorPick.genre_names?.slice(0, 2).map((g: string) => (
                    <Badge key={g} variant="outline">
                      {g}
                    </Badge>
                  ))}
                </div>
                <p className="max-w-[62ch] text-xs leading-relaxed text-muted-foreground line-clamp-3 sm:text-sm">
                  {curatorPick.overview}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 pt-1 sm:mt-5 sm:pt-2">
                <Button asChild size="default" className="w-full sm:w-auto">
                  <Link href={`/movie/detail/${curatorPick.id}`}>
                    <Play className="size-4 fill-current" strokeWidth={2} />
                    <span>Open Screening Dossier</span>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="obi-frame-corners relative order-1 min-h-[190px] border-b border-hairline sm:min-h-[220px] md:order-2 md:col-span-6 md:border-b-0 lg:min-h-[260px]">
              <Image
                unoptimized
                src={
                  curatorPick.backdrop_path ??
                  curatorPick.poster_path ??
                  "/fallback-banner.webp"
                }
                alt={curatorPick.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a]/60 via-transparent to-transparent md:bg-gradient-to-r"
              />
            </div>
          </div>
        </section>
      )}

      <div className="px-4 sm:px-0">
        <MoviesContainerCard
          containerTitle="Prestige Television — Top Rated Series"
          movies={dataTvTopRated.results}
        />
      </div>

      <div className="px-4 sm:px-0">
        <MoviesContainerCard
          containerTitle="Now Airing — Trending Series"
          movies={dataTvTrending.results}
        />
      </div>
    </div>
  );
}
