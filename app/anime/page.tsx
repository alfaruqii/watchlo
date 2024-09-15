import { AnimeContainerCard } from "../components/card/animecard/AnimeContainerCard";
import HeroAnimeCarousel from "../components/hero/anime/HeroAnimeCarousel";
import DashboardAnimeService from "../services";

export default async function Home() {
  const { data: dataTrending } = await DashboardAnimeService.getTrendingAnime();
  const { data: dataRecent } = await DashboardAnimeService.getRecentEpisode();
  const { data: dataPopular } = await DashboardAnimeService.getPopularAnime();
  console.log(dataRecent)

  return (
    <>
      <div className="flex flex-col gap-4 min-h-screen">
        <HeroAnimeCarousel animes={dataTrending.results} />
        <AnimeContainerCard containerTitle="Recently Updated 🎬" animes={dataRecent.results} />
        <AnimeContainerCard containerTitle="Most Popular 💯" animes={dataPopular.results} />
      </div>
    </>
  );
}


