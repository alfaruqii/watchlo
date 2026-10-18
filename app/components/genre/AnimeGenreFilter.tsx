"use client";

import GenreFilter, { ANIME_GENRES } from "./GenreFilter";

export { ANIME_GENRES };

interface AnimeGenreFilterProps {
  activeGenre?: string;
}

export default function AnimeGenreFilter({
  activeGenre = "all",
}: AnimeGenreFilterProps) {
  return <GenreFilter mediaType="anime" activeGenre={activeGenre} />;
}
