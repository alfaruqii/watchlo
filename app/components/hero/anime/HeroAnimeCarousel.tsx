"use client";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";
import HeroAnime from "./HeroAnime";
import { Anime, Title } from "@/types/anime.type";

type Props = {
  animes: Anime[];
};

export default function HeroAnimeCarousel({ animes }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [WheelGesturesPlugin(), Autoplay()]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit(); // Reinitialize Embla when component mounts
    }
  }, [emblaApi, animes]);

  return (
    <div className="relative w-full overflow-x-scroll no-scrollbar" ref={emblaRef}>
      <div className="embla__container flex">
        {animes.map((anime: Anime) => (
          <HeroAnime
            key={anime.id}
            id={anime.id}
            title={anime.title as Title}
            description={anime.description}
            genres={anime.genres}
            bannerImage={anime.bannerImage}
            coverImage={anime.coverImage}
          />
        ))}
      </div>
    </div>
  );
}

