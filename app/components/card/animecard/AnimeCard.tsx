import { AnimePopular, AnimeTrending, AnimeType } from "@/types/anime.type";
import Link from "next/link";
import Image from 'next/image'
import CardImage from "../chunk/CardImage";
import CardTitle from "../chunk/CardTitle";

interface AnimeCardProps {
  anime: AnimeType;
}

interface Routes {
  pathname: string,
  query: {
    animeTitle: string | number;
    ep: number;
  }
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  // Type narrowing for Popular anime
  const isPopularAnime = (anime: AnimeType): anime is AnimePopular => 'coverImage' in anime;

  // Type narrowing for Trending anime
  const isTrendingAnime = (anime: AnimeType): anime is AnimeTrending => 'episodeNumber' in anime;

  // Extract the title based on the type of anime
  const animeTitle = isPopularAnime(anime)
    ? anime.title.userPreferred || anime.title.romaji || anime.title.english || anime.title.native
    : anime.title;

  // Extract the image URL based on whether it's popular or trending
  const animeImage = isPopularAnime(anime)
    ? anime.coverImage.large // Use the large image for popular anime
    : anime.image; // For trending or other types, use the image field

  const determineRoutes = (anime: AnimeType): Routes | string => {
    // condition where the anime is trending anime 
    if ("episodeNumber" in anime) {
      return ({ pathname: `/anime/watch/${anime.episodeId}`, query: { animeTitle: anime.id, ep: anime.episodeNumber } })
    }
    // condition where the anime is popular anime 
    return `/anime/detail/${anime.id}`
  }

  const formattedStatus = isPopularAnime(anime) && anime.status?.replace(/_/g, " ");

  return (
    <>
      <Link href={determineRoutes(anime)}>

        <div key={anime.id} className="group relative transform transition-transform duration-300 ease-out group-hover:scale-105 group-hover:drop-shadow-xl">
          <CardImage
            image={animeImage}
            alt={animeTitle ?? "unknown"}
          />
          <CardTitle title={animeTitle ?? "unknown"} />

          {isTrendingAnime(anime) && (
            <p className="text-xs">Episode {anime.episodeNumber}</p>
          )}

          {isPopularAnime(anime) && (
            <p className="text-xs">Status: {formattedStatus}</p>
          )}
        </div>
      </Link>
    </>
  );
};

