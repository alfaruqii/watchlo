import HeroMediaCarousel from "./components/hero/HeroMediaCarousel";
import { MovieService } from "./services";

export default async function Home() {
  const { data: dataMoviePopular } = await MovieService.getPopularMovies();

  return (
    <div>
      <HeroMediaCarousel items={dataMoviePopular.results} />
    </div>
  );
}

