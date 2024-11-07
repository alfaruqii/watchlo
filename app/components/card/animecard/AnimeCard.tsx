import { Anime, AnimeRecent, AnimeType } from "@/types/anime.type";
import Link from "next/link";
import CardImage from "../chunk/CardImage";
import CardTitle from "../chunk/CardTitle";
import { Routes } from "@/types/global";
import SmallInfo from "@/components/detail/infodetails/SmallInfo";

interface AnimeCardProps {
  anime: AnimeType;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  // Type narrowing for Popular anime
  const isPopularAnime = (anime: AnimeType): anime is Anime =>
    "coverImage" in anime;

  // Type narrowing for Recently Updated Anime
  const isRecentAnime = (anime: AnimeType): anime is AnimeRecent =>
    "episodeNumber" in anime;

  // Extract the title based on the type of anime
  const animeTitle = isPopularAnime(anime)
    ? anime.title?.userPreferred ||
      anime.title?.romaji ||
      anime.title?.english ||
      anime.title?.native
    : anime.title;

  // Extract the image URL based on whether it's popular or trending
  const animeImage = isPopularAnime(anime)
    ? anime.coverImage?.large // Use the large image for popular anime
    : anime.image;

  const determineRoutes = (anime: AnimeType): Routes | string => {
    // condition where the anime is trending anime
    if ("episodeNumber" in anime) {
      return {
        pathname: `/anime/watch`,
        query: { id: String(anime.id), ep: anime.episodeNumber },
      };
    }
    // condition where the anime is popular anime
    return `/anime/detail/${anime.id}`;
  };

  return (
    <>
      <Link href={determineRoutes(anime)}>
        <div
          key={anime.id}
          className="group relative transform transition-transform duration-300 ease-out group-hover:scale-105 group-hover:drop-shadow-xl"
        >
          <CardImage
            image={animeImage ?? "/fallback-card.webp"}
            alt={animeTitle ?? "unknown"}
          />
          <CardTitle title={animeTitle ?? "unknown"} />

          {isRecentAnime(anime) && (
            <p className="text-xs">Episode {anime.episodeNumber}</p>
          )}

          {isPopularAnime(anime) && (
            <SmallInfo
              year={String(anime?.seasonYear || anime.format)}
              genre={anime?.genres?.[0]}
              rating={String(anime?.averageScore / 10)}
            />
          )}
        </div>
      </Link>
    </>
  );
};

export default AnimeCard;
