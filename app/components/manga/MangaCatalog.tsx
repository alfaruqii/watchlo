"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import MangaContainerCard from "@/components/card/mangacard/MangaContainerCard";
import SkeletonMangaShelf from "@/components/skeleton/SkeletonMangaShelf";
import { MangaItem, MangaSubtype } from "@/types/manga.type";

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

const SUBTYPE_TITLES: Record<Exclude<MangaSubtype, "all">, string> = {
  manhwa: "Korean Manhwa & Webtoons",
  manga: "Japanese Manga Serials",
  manhua: "Chinese Manhua Chronicles",
};

interface MangaDefaultShelvesProps {
  trending: MangaItem[];
  popularManhwa: MangaItem[];
  popularManga: MangaItem[];
  popularManhua: MangaItem[];
}

export function MangaDefaultShelves({
  trending,
  popularManhwa,
  popularManga,
  popularManhua,
}: MangaDefaultShelvesProps) {
  return (
    <>
      <div className="px-4 sm:px-0">
        <MangaContainerCard
          containerTitle="Manga & Manhwa Repertory — Trending Now"
          subtitle="Top serialized publications across all mediums"
          mangas={trending}
        />
      </div>

      <div className="px-4 sm:px-0">
        <MangaContainerCard
          containerTitle="Webtoon Strip Gallery — Popular Manhwa"
          subtitle="Full vertical color editions from Korea"
          mangas={popularManhwa}
        />
      </div>

      <div className="px-4 sm:px-0">
        <MangaContainerCard
          containerTitle="Print Classic Archive — Popular Manga"
          subtitle="Curated Japanese serialized masterpieces"
          mangas={popularManga}
        />
      </div>

      {popularManhua.length > 0 && (
        <div className="px-4 sm:px-0">
          <MangaContainerCard
            containerTitle="Imperial Serials — Popular Manhua"
            subtitle="Cultivation, historical & fantasy from China"
            mangas={popularManhua}
          />
        </div>
      )}
    </>
  );
}

function GenreArchiveShelf({
  genre,
  subtype,
}: {
  genre: string;
  subtype: MangaSubtype;
}) {
  const { data, isLoading } = useSWR<{ results?: MangaItem[] }>(
    `/api/manga-search?query=${encodeURIComponent(genre)}&subtype=${subtype}&size=24`,
    fetchJson,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 300000,
    }
  );

  const genreItems: MangaItem[] = data?.results || [];
  const emptyLabel =
    subtype === "all"
      ? "No titles cataloged under genre"
      : `No ${SUBTYPE_TITLES[subtype]} cataloged under genre`;

  return (
    <div className="px-4 sm:px-0">
      {isLoading ? (
        <SkeletonMangaShelf count={5} />
      ) : genreItems.length > 0 ? (
        <MangaContainerCard
          containerTitle={`Genre Archive — ${genre}`}
          subtitle={
            subtype === "all"
              ? "Curated serials & volumes filtered by genre"
              : `Curated ${SUBTYPE_TITLES[subtype]} filtered by genre`
          }
          mangas={genreItems}
        />
      ) : (
        <div className="mx-4 my-6 rounded-sm border border-hairline bg-surface-1 p-6 text-center sm:mx-6 lg:mx-10">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            {emptyLabel} &ldquo;{genre}&rdquo; in current collection.
          </p>
        </div>
      )}
    </div>
  );
}

interface MangaListResponse {
  trending?: MangaItem[];
  popular?: MangaItem[];
}

function MangaSubtypeView({
  subtype,
  genre,
}: {
  subtype: Exclude<MangaSubtype, "all">;
  genre: string;
}) {
  const { data, isLoading } = useSWR<MangaListResponse>(
    `/api/manga-list?subtype=${subtype}`,
    fetchJson,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 300000,
    }
  );

  const subtypeTitle = SUBTYPE_TITLES[subtype];
  const trendingItems = data?.trending || [];
  const popularItems = data?.popular || [];
  const displayTrending =
    trendingItems.length > 0 ? trendingItems : popularItems.slice(0, 15);

  return (
    <>
      {genre && <GenreArchiveShelf genre={genre} subtype={subtype} />}

      {isLoading ? (
        <>
          <SkeletonMangaShelf count={7} />
          <SkeletonMangaShelf count={7} />
        </>
      ) : (
        <>
          <div className="px-4 sm:px-0">
            <MangaContainerCard
              containerTitle={`${subtypeTitle} — Trending Releases`}
              subtitle="Real-time community circulation"
              mangas={displayTrending}
            />
          </div>

          <div className="px-4 sm:px-0">
            <MangaContainerCard
              containerTitle={`${subtypeTitle} — All-Time Essential`}
              subtitle="Highest scoring & read archival editions"
              mangas={popularItems}
            />
          </div>
        </>
      )}
    </>
  );
}

export function MangaSubtypeShell({
  trending,
  popularManhwa,
  popularManga,
  popularManhua,
}: MangaDefaultShelvesProps) {
  const searchParams = useSearchParams();
  const urlSubtype = searchParams.get("subtype");
  const activeSubtype: MangaSubtype =
    urlSubtype === "manhwa" || urlSubtype === "manga" || urlSubtype === "manhua"
      ? urlSubtype
      : "all";
  const activeGenre = searchParams.get("genre")?.trim() || "";

  if (activeSubtype === "all") {
    return (
      <>
        {activeGenre && (
          <GenreArchiveShelf genre={activeGenre} subtype="all" />
        )}
        <MangaDefaultShelves
          trending={trending}
          popularManhwa={popularManhwa}
          popularManga={popularManga}
          popularManhua={popularManhua}
        />
      </>
    );
  }

  return <MangaSubtypeView subtype={activeSubtype} genre={activeGenre} />;
}
