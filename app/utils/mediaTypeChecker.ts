// utils/mediaTypeChecker.ts

import { AnimeDetails, AnimeInfo, SearchedAnime } from "@/types/anime.type";
import { MovieInfo, SearchedMovies, TV, TVInfo } from "@/types/movies.type";

/**
 * Represents a union type of all possible media item types in the application.
 * This type is used for functions that can accept any kind of media item.
 */
export type MediaItem = AnimeInfo | MovieInfo | TVInfo;
export type EpisodesItem = AnimeDetails | TV;
export type SearchedParams = SearchedMovies | SearchedAnime;

/**
 * Type guard to check if a media item is of type AnimeInfo.
 *
 * @param item - The media item to check.
 * @returns True if the item is of type AnimeInfo, false otherwise.
 *
 * Usage:
 * if (isAnimeInfo(item)) {
 *   // TypeScript now knows that item is AnimeInfo
 *   console.log(item.format);
 * }
 */
export const isAnimeInfo = (item: MediaItem): item is AnimeInfo =>
  "format" in item;

export const isAnimeDetails = (item: EpisodesItem): item is AnimeDetails =>
  "subOrDub" in item;

/**
 * Type guard to determine if a SearchedParams is SearchedAnime
 * Checks all properties that are used in the SearchedResult component
 */
export const isSearchedAnime = (
  item: SearchedParams
): item is SearchedAnime => {
  if (!("coverImage" in item)) return false;

  const animeItem = item as SearchedAnime;

  // Check title structure
  return (
    typeof animeItem.title === "object" &&
    animeItem.title !== null &&
    ("userPreferred" in animeItem.title ||
      "english" in animeItem.title ||
      "native" in animeItem.title ||
      "romaji" in animeItem.title) &&
    "format" in animeItem &&
    "seasonYear" in animeItem &&
    "genres" in animeItem &&
    Array.isArray(animeItem.genres)
  );
};

// If you need to check for movies explicitly
export const isSearchedMovie = (
  item: SearchedParams
): item is SearchedMovies => {
  return (
    "poster_path" in item &&
    typeof item.title === "string" &&
    "genres" in item &&
    Array.isArray(item.genres)
  );
};

/**
 * Type guard to check if a media item is of type MovieInfo.
 *
 * @param item - The media item to check.
 * @returns True if the item is of type MovieInfo, false otherwise.
 *
 * Usage:
 * if (isMovieInfo(item)) {
 *   // TypeScript now knows that item is MovieInfo
 *   console.log(item.runtime);
 * }
 */
export const isMovieInfo = (item: MediaItem): item is MovieInfo =>
  "runtime" in item;

/**
 * Type guard to check if a media item is of type TVInfo.
 *
 * @param item - The media item to check.
 * @returns True if the item is of type TVInfo, false otherwise.
 *
 * Usage:
 * if (isTVInfo(item)) {
 *   // TypeScript now knows that item is TVInfo
 *   console.log(item.number_of_episodes);
 * }
 */
export const isTVInfo = (item: MediaItem): item is TVInfo =>
  "number_of_episodes" in item;

/**
 * Determines the type of media item based on its properties.
 *
 * @param item - The media item to check.
 * @returns A string representing the type of media: 'anime', 'movie', or 'tv'.
 * @throws Error if the media type cannot be determined.
 *
 * Usage:
 * const mediaType = getMediaType(item);
 * console.log(`This is a ${mediaType} item`);
 */
export const getMediaType = (item: MediaItem): "anime" | "movie" | "tv" => {
  if (isAnimeInfo(item)) return "anime";
  if (isMovieInfo(item)) return "movie";
  if (isTVInfo(item)) return "tv";
  throw new Error("Unknown media type");
};
