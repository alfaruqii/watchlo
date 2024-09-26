import { MoviesContainerCard } from "./components/card/moviescard/MoviesContainterCard";
import HeroMediaCarousel from "./components/hero/HeroMediaCarousel";
import { MovieService } from "./services";

export default async function Home() {
  const { data: dataMoviePopular } = await MovieService.getPopularMovies();
  const { data: dataMovieTopRated } = await MovieService.getMoviesTopRated();
  const { data: dataTvPopular } = await MovieService.getPopularTV();
  const { data: dataTvTopRated } = await MovieService.getTvTopRated();

  return (
    <>
      <div className="flex flex-col gap-4 min-h-fit">
        <HeroMediaCarousel items={dataMoviePopular.results} />
        <div className="p-4 sm:p-0">
          <MoviesContainerCard containerTitle="Top Rated Movie 🥇" movies={dataMovieTopRated.results} />
        </div>
        <div className="p-4 sm:p-0">
          <MoviesContainerCard containerTitle="Top Rated Series 🏆" movies={dataTvTopRated.results} />
        </div>
        <div className="p-4 sm:p-0">
          <MoviesContainerCard containerTitle="Popular Series 💯" movies={dataTvPopular.results} />
        </div>
      </div>
    </>
  );
}

