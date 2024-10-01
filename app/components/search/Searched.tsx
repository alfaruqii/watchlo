"use client";

import { useEffect, useState, useCallback } from "react";
import SearchedResult from "./SearchedResult";
import SkeletonSearch from "../skeleton/SkeletonSearch";
import { usePathname } from "next/navigation";
import { SearchedAnime } from "@/types/anime.type";

interface SearchedProps {
  searchedText: string;
}

function Searched({ searchedText }: SearchedProps) {
  const pathName = usePathname();
  const pathType = pathName.split('/')[1]; // This gives you either 'anime' or other (movie/tv)
  const [searchedData, setSearchedData] = useState<SearchedAnime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const determineFetchURL = (): string => {
    if (pathType.toLowerCase() === "anime") return `/api/anime-search?query=${encodeURIComponent(searchedText)}`
    return `/api/movie-search?query=${encodeURIComponent(searchedText)}`
  }

  const fetchSearchResults = useCallback(async () => {
    if (!searchedText) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(determineFetchURL())
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }
      const data = await response.json()
      setSearchedData(data.results); // Adjust this based on your API response structure
    } catch (error) {
      console.error("Failed to fetch search results", error);
      setError("Failed to fetch search results.");
    } finally {
      setIsLoading(false);
    }
  }, [searchedText]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  if (!searchedText) return null;

  return (
    <div className="flex flex-col">
      {isLoading && <SkeletonSearch />}
      {error && <p>{error}</p>}
      {!isLoading && searchedData.length > 0 ? (
        searchedData.map((item) => (
          <SearchedResult key={item.id} {...item} />
        ))
      ) : (
        !isLoading && <p>No results found.</p>
      )}
    </div>
  );
}

export default Searched;
