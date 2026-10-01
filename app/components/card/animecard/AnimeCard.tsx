import { Anime, AnimeRecent, AnimeType } from "@/types/anime.type";
import Link from "next/link";
import CardImage from "../chunk/CardImage";
import CardTitle from "../chunk/CardTitle";
import { Routes } from "@/types/global";
import SmallInfo from "@/components/detail/infodetails/SmallInfo";

interface AnimeCardProps {
  anime: AnimeType;
  spineIndex?: number;
}

const AnimeCard = ({ anime, spineIndex }: AnimeCardProps) => {
  const isPopularAnime = (anime: AnimeType): anime is Anime =>
    "coverImage" in anime;

  const isRecentAnime = (anime: AnimeType): anime is AnimeRecent =>
    "episodeNumber" in anime;

  const animeTitle = isPopularAnime(anime)
    ? anime.title?.userPreferred ||
      anime.title?.romaji ||
      anime.title?.english ||
      anime.title?.native
    : anime.title;

  const animeImage = isPopularAnime(anime)
    ? anime.coverImage?.large
    : anime.image;

  const determineRoutes = (anime: AnimeType): Routes | string => {
    if ("episodeNumber" in anime) {
      return {
        pathname: `/anime/watch`,
        query: { id: String(anime.id), ep: anime.episodeNumber },
      };
    }
    return `/anime/detail/${anime.id}`;
  };

  const spineCode =
    typeof spineIndex === "number"
      ? `SPINE #${String(spineIndex + 1).padStart(2, "0")}`
      : `ANIME`;

  return (
    <Link
      href={determineRoutes(anime)}
      className="block w-[164px] shrink-0 sm:w-[228px]"
    >
      <div
        key={anime.id}
        className="group relative flex w-full flex-col rounded-sm border border-hairline bg-surface-1 p-2.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold hover:bg-surface-2 hover:z-10 hover:shadow-sleeve"
      >
        {/* Top Collector Spine Strip */}
        <div className="mb-1.5 flex items-center justify-between gap-1 border-b border-hairline/80 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums">
          <span className="shrink-0 whitespace-nowrap font-semibold text-gold">{spineCode}</span>
          <span className="shrink-0 whitespace-nowrap">
            {isPopularAnime(anime) ? anime.format || "ANIME" : "EPISODE"}
          </span>
        </div>

        <CardImage
          image={animeImage ?? "/fallback-card.webp"}
          alt={animeTitle ?? "unknown"}
        />
        <CardTitle title={animeTitle ?? "unknown"} />

        {isRecentAnime(anime) && (
          <p className="mt-1.5 w-full truncate border-t border-hairline/70 pt-1.5 font-mono text-xs text-gold tabular-nums">
            Episode {anime.episodeNumber}
          </p>
        )}

        {isPopularAnime(anime) && (
          <div className="w-full">
            <SmallInfo
              year={String(anime?.seasonYear || anime.format)}
              genre={anime?.genres?.[0]}
              rating={
                anime?.averageScore
                  ? (anime.averageScore / 10).toFixed(1)
                  : "NR"
              }
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;
