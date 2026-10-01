export type IdProvider = {
  idGogo: string;
  idGogoDub: string;
  idZoro: string;
  id9anime: string;
  idPahe: string;
  idAnikoto?: string;
  [key: string]: string | undefined;
};

// Title type with full structure
export type Title = {
  userPreferred?: string;
  romaji?: string;
  english?: string;
  native?: string;
};

// CoverImage type with optional fields for flexibility
export type CoverImage = {
  extraLarge?: string | null;
  large?: string | null;
  medium?: string | null;
  color?: string | null; // Optional color property
};

export type AnimeTrailer = {
  id: string;
  site: string;
  thumbnail: string;
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
  name: string;
};

export type Tags = {
  id: number;
  name: string;
};

export interface Source {
  url: string;
  isM3U8: boolean;
  quality: string;
  label?: string;
  resolution?: string;
  bandwidth?: number;
  rawUrl?: string;
}

export interface SubtitleTrack {
  file?: string;
  url?: string;
  label: string;
  kind?: "subtitles" | "captions" | "chapters";
  format?: string;
  default?: boolean;
  language?: string;
  rawFile?: string;
}

export interface SkipInterval {
  startTime: number;
  endTime: number;
}

export interface SkipSegment {
  interval: SkipInterval;
  skipType: "op" | "ed" | "recap" | "mixed-op" | "mixed-ed";
  skipId?: string;
  episodeLength?: number;
}

export interface VideoChapter {
  title: string;
  type: string;
  startTime: number;
  endTime: number;
}

export interface AniSkipResults {
  op?: SkipSegment | null;
  ed?: SkipSegment | null;
  recap?: SkipSegment | null;
  mixedOp?: SkipSegment | null;
  mixedEd?: SkipSegment | null;
  chapters?: VideoChapter[];
  all?: SkipSegment[];
}

export interface AniSkipResponse {
  code?: number;
  message?: string;
  found: boolean;
  results?: AniSkipResults;
}

export interface SkipTime {
  intro?: {
    start: number;
    end: number;
  };
  outro?: {
    start: number;
    end: number;
  };
  recap?: {
    start: number;
    end: number;
  };
  chapters?: VideoChapter[];
  raw?: AniSkipResponse;
}

export interface StreamEpisodeInfo {
  title?: string;
  id?: string;
  episode?: string;
  skiptime?: SkipTime;
}

export interface Headers {
  Referer: string;
}

export interface StreamInfo {
  headers: Headers;
  sources: Source[];
  subtitles?: SubtitleTrack[];
  tracks?: SubtitleTrack[];
  info?: StreamEpisodeInfo;
  storyboard?: string | null;
  download?: string;
  provider?: string;
}

export type RelationOrRecommendation = {
  id: number;
  idMal: number;
  title: Title;
  coverImage: CoverImage;
  bannerImage: string;
  genres: string[];
  tags: Tags[];
  type: string;
  format: string;
  status: string;
  episodes: number | null;
  duration: number | null;
  averageScore: number;
  season: string | null;
};

// Core Anime type definition (usually for trending and popular)
export type Anime = {
  id: number;
  idMal: number;
  status: string;
  title: Title;
  genres: string[];
  tags: Tags[];
  description: string;
  bannerImage?: string;
  coverImage?: CoverImage;
  episodes: number | null;
  meanScore?: number;
  format?: string;
  duration: number;
  season: string;
  seasonYear?: number;
  averageScore: number;
  nextAiringEpisode?: NextAiringEpisode | null;
  trailer: AnimeTrailer;
  isAdult?: boolean;
};

// Trending Anime with essential fields
export interface AnimeRecent {
  id: string;
  episodeId: string;
  episodeNumber: number;
  title: string;
  image: string;
  url: string;
}

// Union type for AnimeType
export type AnimeType = AnimeRecent | Anime;

// Detailed AnimeInfo Single (e.g One Piece) interface, removing redundancies and reusing existing types
export interface AnimeInfo extends Omit<Anime, "averageScore" | "type"> {
  code: number;
  message: string;
  id_provider: IdProvider;
  title: Title;
  dub: boolean;
  format?: string;
  year: number;
  startIn: Date;
  endIn: Date;
  nextair: string | null;
  score: {
    averageScore: number;
    decimalScore: number;
  };
  popularity: number;
  siteUrl: string;
  studios: Studio[];
  relation: RelationOrRecommendation[];
}

export interface AnimeEpisode {
  id: string;
  number: number;
  url: string;
}

// AnimeDetail single for from V1 API
export interface AnimeDetails {
  id: string;
  title: string;
  url: string;
  genres: string[];
  totalEpisodes: number;
  image: string;
  image_url?: string;
  releaseDate?: string;
  released?: string;
  description?: string;
  synopsis?: string;
  subOrDub: "sub" | "dub"; // Restrict to 'sub' or 'dub'
  type: string;
  status: string;
  otherName?: string;
  otherNames?: string[] | string;
  episodes: AnimeEpisode[]; // Array of episode objects
}

export interface SearchedAnime {
  id: number;
  status: string;
  idMal: number;
  title: Title;
  bannerImage: string;
  coverImage: CoverImage;
  episodes: number;
  genres: string[];
  tags: Tags[];
  season: string;
  format: string;
  type: string;
  seasonYear: number;
  averageScore: number;
  nextAiringEpisode: unknown;
}

export interface MediaVoiceActor {
  id: number;
  name: {
    full: string;
    native: string | null;
    userPreferred: string;
  };
  language: string;
  image: {
    large?: string | null;
    medium?: string | null;
  };
  siteUrl?: string;
}

export interface MediaCharacterItem {
  id: number;
  role: "MAIN" | "SUPPORTING" | string;
  name: {
    full: string;
    native: string | null;
    userPreferred: string;
  };
  image: {
    large?: string | null;
    medium?: string | null;
  };
  voiceActors?: MediaVoiceActor[];
  siteUrl?: string;
}

export interface MediaStaffItem {
  id: number;
  role: string;
  name: {
    full: string;
    native: string | null;
    userPreferred: string;
  };
  image: {
    large?: string | null;
    medium?: string | null;
  };
  primaryOccupations?: string[];
  siteUrl?: string;
}

export interface MediaStudioItem {
  id: number;
  name: string;
  isAnimationStudio?: boolean;
  isMain?: boolean;
  siteUrl?: string;
}

export interface AnimeCreditsResponse {
  code?: number;
  message?: string;
  id: number;
  idMal?: number;
  title?: Title;
  type?: string;
  studios?: MediaStudioItem[];
  characters: MediaCharacterItem[];
  staff: MediaStaffItem[];
}

export interface AdvancedSearchPayload {
  page?: number;
  size?: number;
  search?: string;
  genres?: string[];
  excludedGenres?: string[];
  tags?: string[];
  format?: string[];
  status?: string;
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear?: number;
  sort?: string[];
}

