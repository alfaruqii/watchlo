// Title type with full structure
export type Title = {
  userPreferred: string;
  romaji?: string;
  english?: string;
  native?: string;
};

// CoverImage type with optional fields for flexibility
export type CoverImage = {
  extraLarge?: string;
  large: string;
  medium?: string;
  color?: string; // Optional color property
};

// Date type used for startDate and endDate
export type Date = {
  year: number | null;
  month: number | null;
  day: number | null;
};

// NextAiringEpisode type
export type NextAiringEpisode = {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
};

// Studio related types
export type Studio = {
  id: number;
  name: string;
};

export type StudioEdge = {
  isMain: boolean;
  node: Studio;
};

export type Studios = {
  edges: StudioEdge[];
};

// Core Anime type definition
export type Anime = {
  id: number;
  title: Title | string;
  description: string;
  coverImage: CoverImage;
  startDate: Date;
  endDate: Date;
  bannerImage: string;
  season: string;
  seasonYear: number;
  type: string;
  format: string;
  status: string;
  episodes: number | null;
  duration: number;
  chapters: number | null;
  volumes: number | null;
  genres: string[];
  isAdult: boolean;
  averageScore: number;
  popularity: number;
  nextAiringEpisode: NextAiringEpisode | null;
  mediaListEntry: unknown;  // Adjust if you know the exact type
  studios: Studios;
};

// Base interface for Anime
export interface AnimeBase {
  id: string | number;
}

// Trending Anime with essential fields
export interface AnimeTrending extends AnimeBase {
  title: string;
  image: string;
  episodeNumber: number;
  episodeId: string;
}

// Popular Anime, using the existing Title and CoverImage types
export interface AnimePopular extends AnimeBase {
  title: Title;
  coverImage: CoverImage;
  status: string;
}

// Union type for AnimeType
export type AnimeType = AnimeTrending | AnimePopular;

// Detailed AnimeInfo interface, removing redundancies and reusing existing types
export interface AnimeInfo extends AnimeBase {
  code: number;
  message: string;
  idMal: number;
  id_provider: {
    idGogo: string;
    idGogoDub: string;
    idZoro: string;
    id9anime: string;
    idPahe: string;
  };
  title: Title;
  dub: boolean;
  description: string;
  coverImage: {
    large: string;
    medium: string;
    color: string;
  };
  bannerImage: string;
  genres: string[];
  tags: {
    id: number;
    name: string;
  }[];
  status: string;
  format: string;
  episodes: number;
  year: number;
  season: string;
  duration: number;
  startIn: Date;
  endIn: Date;
  nextair: null | string;
  score: {
    averageScore: number;
    decimalScore: number;
  };
  popularity: number;
  siteUrl: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  };
  studios: {
    name: string;
  }[];
  relation: {
    id: number;
    idMal: number;
    title: Title;
    coverImage: CoverImage;
    bannerImage: string;
    genres: string[];
    tags: {
      id: number;
      name: string;
    }[];
    type: string;
    format: string;
    status: string;
    episodes: number | null;
    duration: number | null;
    averageScore: number;
    season: string | null;
  }[];
}

export interface Episode {
  id: string;
  number: number;
  url: string;
}

export interface AnimeDetails {
  id: string;
  title: string;
  url: string;
  genres: string[];
  totalEpisodes: number;
  image: string;
  releaseDate: string;
  description: string;
  subOrDub: 'sub' | 'dub';  // Restrict to 'sub' or 'dub'
  type: string;
  status: string;
  otherName: string;
  episodes: Episode[];  // Array of episode objects
}

export interface Source {
  url: string;
  isM3U8: boolean;
  quality: string;
}

export interface Headers {
  Referer: string;
}

export interface StreamInfo {
  headers: Headers;
  sources: Source[];
  download: string;
}

