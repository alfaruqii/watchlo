import { MoviesContainerCard } from "./components/card/moviescard/MoviesContainterCard";
import HeroMediaCarousel from "./components/hero/HeroMediaCarousel";
import { MovieService } from "./services";

export default async function Home() {
  const { data: dataMoviesPopular } = await MovieService.getMoviesPopular();
  const { data: dataMoviesTopRated } = await MovieService.getMoviesTopRated();
  const { data: dataMoviesTrending } = await MovieService.getMoviesTrending();
  const { data: dataTvTopRated } = await MovieService.getTvTopRated();
  const { data: dataTvTrending } = await MovieService.getTvTrending();

  return (
    <>
      <div className="flex flex-col gap-2 min-h-fit">
        <HeroMediaCarousel items={dataMoviesPopular.results} />
        <div className="p-4 sm:p-0">
          <MoviesContainerCard
            containerTitle="Top Rated Movie 🥇"
            movies={dataMoviesTopRated.results}
          />
        </div>
        <div className="p-4 sm:p-0">
          <MoviesContainerCard
            containerTitle="Trending Movies 📈"
            movies={dataMoviesTrending.results}
          />
        </div>
        <div className="p-4 sm:p-0">
          <MoviesContainerCard
            containerTitle="Top Rated Series 🏆"
            movies={dataTvTopRated.results}
          />
        </div>
        <div className="p-4 sm:p-0">
          <MoviesContainerCard
            containerTitle="Trending Series 🔥"
            movies={dataTvTrending.results}
          />
        </div>
      </div>
    </>
  );
}
