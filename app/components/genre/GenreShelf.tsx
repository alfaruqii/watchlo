"use client";

import { useSearchParams } from "next/navigation";
import { MoviesContainerCard } from "@/components/card/moviescard/MoviesContainterCard";
import { MovieInfo, TVInfo } from "@/types/movies.type";

interface GenreShelfProps {
  pool: (MovieInfo | TVInfo)[];
}

export default function GenreShelf({ pool }: GenreShelfProps) {
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get("genre")?.trim() || "";

  if (!activeGenre) return null;

  const seen = new Set<number>();
  const genreResults = pool.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return (
      item.genre_names?.some(
        (g) => g.toLowerCase() === activeGenre.toLowerCase()
      ) ?? true
    );
  });

  return (
    <div className="px-4 sm:px-0">
      {genreResults.length > 0 ? (
        <MoviesContainerCard
          containerTitle={`Genre Archive — ${activeGenre}`}
          movies={genreResults}
        />
      ) : (
        <div className="mx-4 my-6 rounded-sm border border-hairline bg-surface-1 p-6 text-center sm:mx-6 lg:mx-10">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            No titles cataloged under genre &ldquo;{activeGenre}&rdquo; in
            current collection.
          </p>
        </div>
      )}
    </div>
  );
}
