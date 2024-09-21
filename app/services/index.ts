import { getEnv } from "@/utils/getEnv";
import { AnimeRecQueryParams } from "../interfaces/anime";
import { API_V1, API_V2 } from "../lib/api"
import { AxiosResponse } from 'axios';

const ANIME_PATH = getEnv("ANIME_PATH") || process.env["NEXT_PUBLIC_ANIME_PATH"];

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

export { AnimeServiceV1, AnimeServiceV2 };
