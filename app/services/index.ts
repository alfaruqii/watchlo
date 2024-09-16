import { AnimeRecQueryParams } from "../interfaces/anime";
import { API_V1, API_V2 } from "../lib/api"
import { AxiosResponse } from 'axios';


const AnimeServiceV1 = {
  getRecentEpisode: async (): Promise<AxiosResponse> => {
    return API_V1().get(`/anime/gogoanime/recent-episodes`);
  },
  getAnimeStream: async (id: string): Promise<AxiosResponse> => {
    return API_V1().get(`/anime/gogoanime/watch/${id}`);
  },
  getAnimeInfoV1: async (id: string): Promise<AxiosResponse> => {
    return API_V1().get(`/anime/gogoanime/info/${id}`);
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
}

export { AnimeServiceV1, AnimeServiceV2 };
