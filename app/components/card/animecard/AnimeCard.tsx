import { AnimePopular, AnimeTrending, AnimeType } from "@/types/anime.type";
import Link from "next/link";
import Image from 'next/image'

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

  return (
    <>
      <Link href={determineRoutes(anime)}>

        <div key={anime.id} className="group relative transform transition-transform duration-300 ease-out group-hover:scale-105 group-hover:drop-shadow-xl">
          <div className="card mb-1 max-h-44 h-44 w-32 overflow-hidden rounded sm:max-h-72 sm:h-72 sm:w-52">
            <figure className="relative h-full w-full overflow-hidden">
              <Image
                className="max-h-44 min-h-44  object-cover transition-transform duration-300 ease-out group-hover:scale-110 sm:min-h-72 sm:min-w-52"
                width={1000}
                height={1000}
                src={animeImage}
                alt={animeTitle ?? "unknown"}
              />
            </figure>
          </div>
          <div className="w-32 sm:w-52"> {/* Add a width constraint */}
            <p className="line-clamp-2 text-sm font-bold">{animeTitle}</p>
          </div>

          {isTrendingAnime(anime) && (
            <p className="text-xs">Episode {anime.episodeNumber}</p>
          )}

          {isPopularAnime(anime) && (
            <p className="text-xs">Status: {anime.status}</p>
          )}
        </div>
      </Link>
    </>
  );
};

