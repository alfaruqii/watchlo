import { AnimeContainerCard } from "../components/card/animecard/AnimeContainerCard";
import HeroAnimeCarousel from "../components/hero/anime/HeroAnimeCarousel";
import { AnimeServiceV1, AnimeServiceV2 } from "../services";

export default async function Home() {
  const { data: dataTrending } = await AnimeServiceV2.getTrendingAnime();
  const { data: dataRecent } = await AnimeServiceV1.getRecentEpisode();
  const { data: dataPopular } = await AnimeServiceV2.getPopularAnime();

  return (
    <>
      <div className="flex flex-col gap-4 min-h-fit">
        <HeroAnimeCarousel animes={dataTrending.results} />
        <AnimeContainerCard containerTitle="Recently Updated 🎬" animes={dataRecent.results} />
        <AnimeContainerCard containerTitle="Most Popular 💯" animes={dataPopular.results} />
      </div>
    </>
  );
}


