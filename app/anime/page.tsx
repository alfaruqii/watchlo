import HeroMediaCarousel from "@/components/hero/HeroMediaCarousel";
import { AnimeContainerCard } from "../components/card/animecard/AnimeContainerCard";
import { AnimeServiceV1, AnimeServiceV2 } from "../services";

export default async function Home() {
  const { data: dataTrending } = await AnimeServiceV2.getTrendingAnime();
  const { data: dataRecent } = await AnimeServiceV1.getRecentEpisodeGogo();
  const { data: dataPopular } = await AnimeServiceV2.getPopularAnime();

  return (
    <>
      <div className="flex flex-col gap-4 min-h-fit">
        <HeroMediaCarousel items={dataTrending.results} />
        <div className="p-4 sm:p-0">
          <AnimeContainerCard
            containerTitle="Recently Updated 🎬"
            animes={dataRecent.results}
          />
        </div>
        <div className="p-4 sm:p-0">
          <AnimeContainerCard
            containerTitle="Most Popular 💯"
            animes={dataPopular.results}
          />
        </div>
      </div>
    </>
  );
}
