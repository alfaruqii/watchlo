import { getEnv } from "@/utils/getEnv";
import { AnimeRecQueryParams } from "@/types/global";
import { API_V0, API_V1, API_V2 } from "../lib/api"
import { AxiosResponse } from 'axios';

const ANIME_PATH = getEnv("ANIME_PATH") || process.env["NEXT_PUBLIC_ANIME_PATH"];

const MovieService = {
  getPopularMovies: async (): Promise<AxiosResponse> => {
    return API_V0().get("/tmdb/movies/popular");
  },
  getMoviesTopRated: async (): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/movies/top-rated`);
  },
  getMoviesById: async (id: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/movies/${id}`);
  },
  getMovieTrailer: async (id: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/movies/${id}/videos`);
  },
  getMovieReviews: async (id: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/movies/${id}/reviews`);
  },
  getPopularTV: async (): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/popular`);
  },
  getTvTopRated: async (): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/top-rated`);
  },
  getTvById: async (id: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/${id}`);
  },
  getTvSeason: async (id: string, season: number): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/${id}/season/${season}`);
  },
  getTvEpisode: async (id: string, season: string, episode: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/${id}/season/${season}/episode/${episode}`);
  },
  getTVTrailer: async (id: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/${id}/videos`);
  },
  getTVReviews: async (id: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/${id}/reviews`);
  },
  searchMovie: async (title?: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/search?q=${title}`);
  },
}

const AnimeServiceV1 = {
  getRecentEpisode: async (): Promise<AxiosResponse> => {
    return API_V1().get(`${ANIME_PATH}/recent-episodes`);
  },
  getAnimeStream: async (id: string): Promise<AxiosResponse> => {
    return API_V1().get(`${ANIME_PATH}/watch/${id}`);
  },
  getAnimeInfoV1: async (id: string): Promise<AxiosResponse> => {
    return API_V1().get(`${ANIME_PATH}/info/${id}`);
  },
}

const AnimeServiceV2 = {
  getTrendingAnime: async (): Promise<AxiosResponse> => {
    return API_V2().get(`/trending`);
  },
  getPopularAnime: async (): Promise<AxiosResponse> => {
    return API_V2().get(`/popular`);
  },
  getAnimeInfoV2: async (id: string): Promise<AxiosResponse> => {
    return API_V2().get(`/info/${id}`);
  },
  getRecommendationAnime: async (params: AnimeRecQueryParams): Promise<AxiosResponse> => {
    return API_V2().get(`/recommendations/${params.id}`);
  },
  searchAnimeV2: async (title?: string): Promise<AxiosResponse> => {
    return API_V2().get(`/search?q=${title}`);
  },
}

export { MovieService, AnimeServiceV1, AnimeServiceV2 };
