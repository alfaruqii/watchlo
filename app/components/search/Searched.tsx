"use client";

import { useEffect, useState, useCallback } from "react";
import { SearchX } from "lucide-react";
import SearchedResult from "./SearchedResult";
import SkeletonSearch from "../skeleton/SkeletonSearch";
import { usePathname } from "next/navigation";
import { SearchedParams } from "@/utils/mediaTypeChecker";

interface SearchedProps {
  searchedText: string;
}

function Searched({ searchedText }: SearchedProps) {
  const pathName = usePathname();
  const pathType = pathName.split("/")[1];
  const [searchedData, setSearchedData] = useState<SearchedParams[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = useCallback(async () => {
    if (!searchedText) return;

    setIsLoading(true);
    setError(null);

    const isManga = pathType?.toLowerCase() === "manga";
    const isAnime = pathType?.toLowerCase() === "anime";

    const fetchUrl = isManga
      ? `/api/manga-search?query=${encodeURIComponent(searchedText)}`
      : isAnime
      ? `/api/anime-search?query=${encodeURIComponent(searchedText)}`
      : `/api/movie-search?query=${encodeURIComponent(searchedText)}`;

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setSearchedData(data.results ?? []);
    } catch (error) {
      console.error("Failed to fetch search results", error);
      setError("Unable to retrieve catalog results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [searchedText, pathType]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  if (!searchedText) return null;

  return (
    <div className="flex flex-col divide-y divide-hairline/60 px-2 py-2">
      {isLoading && <SkeletonSearch />}
      {error && (
        <p className="px-3 py-4 font-mono text-xs text-vermilion">{error}</p>
      )}
      {!isLoading && searchedData.length > 0 ? (
        searchedData.map((item) => <SearchedResult key={item.id} {...item} />)
      ) : (
        !isLoading && (
          <div className="flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground">
            <SearchX className="size-4 text-gold" strokeWidth={1.75} />
            <span>No matching editions found in this catalog index.</span>
          </div>
        )
      )}
    </div>
  );
}

export default Searched;
