import { useEffect, useState } from "react";
import { AnimeServiceV2 } from "@/services";
import SearchedResult from "./SearchedResult";
import SkeletonSearch from "../skeleton/SkeletonSearch";

interface SearchedProps {
  searchedText?: string;
}

function Searched({ searchedText }: SearchedProps) {
  const [searchedData, setSearchedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchedText) {
        setIsLoading(true);
        setError(null);
        try {
          const { data } = await AnimeServiceV2.searchAnimeV2(searchedText);
          setSearchedData(data.results); // Assuming data.results contains the anime data
        } catch (error) {
          console.error("Failed to fetch search results", error);
          setError("Failed to fetch search results.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSearchResults();
  }, [searchedText]);

  if (!searchedText) return null; // Render nothing if no search input

  return (
    <div className="flex flex-col">
      {isLoading && <SkeletonSearch />} {/* Show loading skeleton */}
      {error && <p>{error}</p>} {/* Display error if exists */}
      {!isLoading && searchedData.length > 0 ? (
        searchedData.map((anime) => (
          <SearchedResult key={anime.id} {...anime} /> // Render each search result
        ))
      ) : (
        !isLoading && <p>No results found.</p> // Show message when no results are found
      )}
    </div>
  );
}

export default Searched;

