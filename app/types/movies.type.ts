interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface Collection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface BaseMediaInfo {
  adult: boolean;
  backdrop_path: string;
  genre_names: string[]; // Array of genre names as strings
  homepage: string;
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  origin_country: string[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieInfo extends BaseMediaInfo {
  original_title: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  video: boolean;
  belongs_to_collection: Collection | null;
  budget: number | null;
  imdb_id: string;
  genres: Genre[];
}

export interface TVInfo extends BaseMediaInfo {
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    original_name: string;
    gender: number;
    profile_path: string;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: SeriesEpisode;
  name: string;
  next_episode_to_air: SeriesEpisode | null;
  networks: ProductionCompany[];
  number_of_episodes: number;
  number_of_seasons: number;
  original_name: string;
  seasons: Seasons[];
  type: string;
  genres: Genre[];
}

export interface Seasons {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

interface BaseEpisode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
}

export interface SeriesEpisode extends BaseEpisode {
  episode_type: string;
  production_code: string;
  runtime: number;
  show_id: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
  thumbnail: string;
}

export interface CrewMember {
  id: number;
  name: string;
  department: string;
  job: string;
}

export interface GuestStar {
  id: number;
  name: string;
  character: string;
  order: number;
}

export interface TV {
  _id: string;
  air_date: string;
  episodes: SeriesEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface AuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number;
}

export interface Review {
  id: string;
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
  rating?: number;
}

export type MediaType = "movie" | "tv";

export interface SearchedMovies {
  backdrop_path: string;
  id: number;
  name?: string; // For TV shows
  original_name?: string; // For TV shows
  title?: string; // For movies
  original_title?: string; // For movies
  overview: string;
  poster_path: string;
  media_type: MediaType;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
  genre_names: string[];

  // Fields specific to TV shows
  first_air_date?: string;
  origin_country?: string[];

  // Fields specific to movies
  release_date?: string;
  video?: boolean;
}
