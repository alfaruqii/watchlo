import Image from "next/image";
import Link from "next/link";
import { useThemeStore } from "@/store/themeStore";
import { useModalStore } from "@/store/modalStore";
import { isSearchedAnime, SearchedParams } from "@/utils/mediaTypeChecker";
import SearchedGenre from "../genre/SearchedGenre";

function SearchedResult(props: SearchedParams) {
  const { closeModal } = useModalStore();
  const { theme } = useThemeStore();
  const isAnime = isSearchedAnime(props);

  const imgSrc = isAnime
    ? props.coverImage?.large ?? props.coverImage?.medium ?? props.coverImage?.color ?? props.bannerImage
    : props.poster_path ?? props.backdrop_path;

  const title = isAnime
    ? props.title.userPreferred ?? props.title.english ?? props.title.native ?? props.title.romaji
    : props.title || props.name;

  return (
    <Link
      onClick={closeModal}
      href={`/${isAnime ? 'anime' : 'movie'}/detail/${props.id}`}
      className={`${theme === "garden" ? "hover:bg-gray-400 " : "hover:bg-gray-800"} rounded p-3`}
    >
      <div className="w-full flex gap-2">
        <div className="relative w-32 h-36">
          <Image
            src={imgSrc ?? '/fallback-card.webp'}
            alt={title ?? 'Windah Batubara'}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex flex-col gap-1 w-5/6">
          <p className="font-bold line-clamp-2">{title}</p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-sm uppercase">
              {isAnime ? props.format || "unknown" : props.media_type || "unknown"}
            </span> |
            <span className="text-sm capitalize">
              {isAnime ? props.seasonYear || props.title.native || props.format || "unknown" : props.release_date?.split('-')[0] || props.original_language || props.origin_country?.[0] || "unknown"}
            </span>
          </div>
          <div className="flex gap-1">
            {isAnime ? props.genres?.slice(0, 2).map((genre: string, i: number) => (
              <SearchedGenre key={i} genre={genre} theme={theme} />
            )) : props.genre_names?.slice(0, 2).map((genre: string, i: number) => (
              <SearchedGenre key={i} genre={genre} theme={theme} />
            ))
            }
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SearchedResult;
