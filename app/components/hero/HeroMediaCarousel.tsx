"use client";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";
import HeroMedia from "./HeroMedia";
import { MovieInfo } from "@/types/movies.type"; // Assuming you have a types file that includes both
import { Anime } from "@/types/anime.type"; // Assuming you have a types file that includes both

type Media = Anime | MovieInfo;

type MediaCarouselProps = {
  items: Media[];
};

export default function HeroMediaCarousel({ items }: MediaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [WheelGesturesPlugin(), Autoplay()]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit(); // Reinitialize Embla when component mounts
    }
  }, [emblaApi, items]);

  return (
    <div className="relative w-full overflow-x-scroll no-scrollbar" ref={emblaRef}>
      <div className="embla__container flex">
        {items.map((item) => (
          <HeroMedia
            key={item.id}
            id={item.id}
            title={
              'title' in item && typeof item.title !== 'string' ?
                item.title.userPreferred :
                item.title
            }
            description={"description" in item ? item.description : item.overview ?? "unknown description"}
            bannerImage={"backdrop_path" in item ? item.backdrop_path : item.bannerImage ?? "/fallback-banner.webp"}
            coverImage={"poster_path" in item ? item.poster_path : item.coverImage?.extraLarge ?? '/fallback-card.webp'}
            genres={"genre_names" in item ? item.genre_names : item.genres}
          />


        ))}
      </div>
    </div>
  );
}

