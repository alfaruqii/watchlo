import { AnimePopular, AnimeTrending, AnimeType } from "@/app/types/anime.type";
import Link from "next/link";

interface AnimeCardProps {
  anime: AnimeType;
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

  const determineRoutes = (anime: AnimeType): {} | string => {
    // condition where the anime is trending anime 
    if ("episodeNumber" in anime) {
      return ({ pathname: `/anime/watch/${anime.episodeId}`, query: { animeId: anime.id, ep: anime.episodeNumber } })
    }
    // condition where the anime is popular anime 
    return `/anime/detail/${anime.id}`
  }

  return (
    <>
      <Link href={determineRoutes(anime)}>

        <div key={anime.id} className="group relative transition-transform duration-300 ease-out transform group-hover:scale-105 group-hover:drop-shadow-xl">
          <div className="card mb-1 max-h-44 min-h-44 min-w-32 overflow-hidden rounded sm:max-h-72 sm:min-h-72 sm:min-w-52">
            <figure className="relative w-full h-full overflow-hidden">
              <img
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                src={animeImage}
                alt={animeTitle}
              />
            </figure>
          </div>
          <p className="line-clamp-2 text-sm font-bold">{animeTitle}</p>

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

