"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useModalStore } from "@/store/modalStore";
import { isSearchedAnime, SearchedParams } from "@/utils/mediaTypeChecker";
import SearchedGenre from "../genre/SearchedGenre";
import { useThemeStore } from "@/store/themeStore";

function SearchedResult(props: SearchedParams) {
  const { theme } = useThemeStore();
  const [isImageLoading, setImageLoading] = useState(true);
  const { closeModal } = useModalStore();
  const isAnime = isSearchedAnime(props);

  const imgSrc = isAnime
    ? props.coverImage?.large ??
      props.coverImage?.medium ??
      props.coverImage?.color ??
      props.bannerImage
    : props.poster_path ?? props.backdrop_path;

  const title = isAnime
    ? props.title.userPreferred ??
      props.title.english ??
      props.title.native ??
      props.title.romaji
    : props.title || props.name;

  const format = !isAnime ? props.media_type?.toLowerCase() : "movie";

  return (
    <Link
      onClick={closeModal}
      href={`/${
        isAnime ? "anime" : format === "movie" ? "movie" : "series"
      }/detail/${props.id}`}
      className={`${
        theme === "garden" ? "hover:bg-gray-400 " : "hover:bg-gray-800"
      } rounded p-3`}
    >
      <div className="w-full flex gap-2">
        <div className="relative w-32 h-36 overflow-hidden">
          <Image
            unoptimized
            src={imgSrc ?? "/fallback-card.webp"}
            alt={title ?? "Windah Batubara"}
            fill
            onLoad={() => setImageLoading(false)}
            className={`transition-custom-blur object-cover rounded ${
              isImageLoading ? "blur-3xl" : "blur-0"
            }`}
          />
        </div>
        <div className="flex flex-col gap-1 w-5/6">
          <p className="font-bold line-clamp-2">{title}</p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-sm uppercase">
              {isAnime
                ? props.format || "unknown"
                : props.media_type || "unknown"}
            </span>{" "}
            |
            <span className="text-sm capitalize line-clamp-1">
              {isAnime
                ? props.seasonYear ||
                  props.title.native ||
                  props.format ||
                  "unknown"
                : props.release_date?.split("-")[0] ||
                  props.original_language ||
                  props.origin_country?.[0] ||
                  "unknown"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {isAnime ? (
              props.genres?.length ? (
                props.genres
                  ?.slice(0, 2)
                  .map((genre: string, i: number) => (
                    <SearchedGenre key={i} genre={genre} />
                  ))
              ) : props.tags.length ? (
                props.tags?.map((tag, i) => (
                  <SearchedGenre key={i} genre={tag.name} />
                ))
              ) : (
                <SearchedGenre genre={props.status} />
              )
            ) : props.genre_names?.length ? (
              props.genre_names
                ?.slice(0, 2)
                .map((genre: string, i: number) => (
                  <SearchedGenre key={i} genre={genre} />
                ))
            ) : (
              <span className="line-clamp-3 text-sm">{props.overview}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SearchedResult;
