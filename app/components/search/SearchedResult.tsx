"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useModalStore } from "@/store/modalStore";
import { usePathname } from "next/navigation";
import {
  isSearchedAnime,
  isSearchedManga,
  SearchedParams,
} from "@/utils/mediaTypeChecker";
import { SearchedAnime } from "@/types/anime.type";
import { MangaItem } from "@/types/manga.type";
import { SearchedMovies } from "@/types/movies.type";
import SearchedGenre from "../genre/SearchedGenre";

function SearchedResult(props: SearchedParams) {
  const [isImageLoading, setImageLoading] = useState(true);
  const { closeModal } = useModalStore();
  const pathname = usePathname();
  const pathType = pathname.split("/")[1]?.toLowerCase();

  const isManga = pathType === "manga" || isSearchedManga(props);
  const isAnime = !isManga && isSearchedAnime(props);

  let imgSrc: string = "/fallback-card.webp";
  let title: string = "Unknown Edition";
  let formatLabel: string = "CINEMA";
  let secondaryMeta: string = "Archive";
  let targetHref: string = `/movie/detail/${props.id}`;
  let genreItems: string[] = [];
  let overviewText: string | undefined;

  if (isManga) {
    const m = props as MangaItem;
    targetHref = `/manga/detail/${m.id}`;
    imgSrc =
      m.coverImage?.extraLarge ||
      m.coverImage?.large ||
      m.coverImage?.medium ||
      m.image ||
      "/fallback-card.webp";
    title =
      m.title?.userPreferred ||
      m.title?.english ||
      m.title?.romaji ||
      m.title?.native ||
      "Manga Edition";
    formatLabel = (m.subtype || m.format || "MANGA").toUpperCase();
    secondaryMeta = m.year ? String(m.year) : m.status || "Serial";
    genreItems = m.genres?.slice(0, 2) || (m.status ? [m.status] : []);
  } else if (isAnime) {
    const a = props as SearchedAnime;
    targetHref = `/anime/detail/${a.id}`;
    imgSrc =
      a.coverImage?.extraLarge ||
      a.coverImage?.large ||
      a.coverImage?.medium ||
      a.bannerImage ||
      "/fallback-card.webp";
    title =
      a.title?.userPreferred ||
      a.title?.english ||
      a.title?.native ||
      a.title?.romaji ||
      "Anime Edition";
    formatLabel = a.format || "ANIME";
    secondaryMeta =
      a.seasonYear ? String(a.seasonYear) : a.status || "Archive";
    genreItems =
      a.genres?.slice(0, 2) ||
      a.tags?.slice(0, 2).map((t) => t.name) ||
      (a.status ? [a.status] : []);
  } else {
    const mov = props as SearchedMovies;
    const isTv = mov.media_type === "tv";
    targetHref = `/${isTv ? "series" : "movie"}/detail/${mov.id}`;
    imgSrc = mov.poster_path || mov.backdrop_path || "/fallback-card.webp";
    title = mov.title || mov.name || "Cinema Edition";
    formatLabel = mov.media_type ? mov.media_type.toUpperCase() : "CINEMA";
    secondaryMeta =
      mov.release_date?.split("-")[0] ||
      mov.original_language?.toUpperCase() ||
      "Archive";
    genreItems = mov.genre_names?.slice(0, 2) || [];
    overviewText = mov.overview;
  }

  return (
    <Link
      onClick={closeModal}
      href={targetHref}
      className="group rounded-sm p-2.5 transition-colors hover:bg-surface-2"
    >
      <div className="flex w-full gap-3">
        <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-sm border border-hairline bg-surface-3">
          <Image
            unoptimized
            src={imgSrc}
            alt={title}
            fill
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            className={`object-cover transition-custom-blur ${
              isImageLoading ? "blur-2xl" : "blur-0"
            }`}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <p className="line-clamp-1 font-display text-sm font-bold text-foreground group-hover:text-gold">
              {title}
            </p>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
              <span className="uppercase text-gold font-semibold">
                {formatLabel}
              </span>
              <span>·</span>
              <span className="line-clamp-1 capitalize">{secondaryMeta}</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {genreItems.map((g, i) => (
              <SearchedGenre key={i} genre={g} />
            ))}
            {overviewText && genreItems.length === 0 && (
              <span className="line-clamp-2 text-xs text-muted-foreground">
                {overviewText}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SearchedResult;
