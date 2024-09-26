import { getEnv } from "@/utils/getEnv";
import { AnimeRecQueryParams } from "../interfaces/anime";
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
  getPopularTV: async (): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/popular`);
  },
  getTvTopRated: async (): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/top-rated`);
  },
  getTvById: async (id: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/${id}`);
  },
  getTVTrailer: async (id: string): Promise<AxiosResponse> => {
    return API_V0().get(`/tmdb/tv/${id}/videos`);
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
