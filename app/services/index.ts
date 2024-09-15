import { AnimeRecQueryParams } from "../interfaces/anime";
import { API_V1, API_V2 } from "../lib/api"
import { AxiosResponse } from 'axios';


const DashboardAnimeService = {
  getTrendingAnime: async (): Promise<AxiosResponse> => {
    return API_V2().get(`/trending`);
  },
  getRecentEpisode: async (): Promise<AxiosResponse> => {
    return API_V1().get(`/anime/gogoanime/recent-episodes`);
  },
  getPopularAnime: async (): Promise<AxiosResponse> => {
    return API_V2().get(`/popular`);
  },
  getRecommendationAnime: async (params: AnimeRecQueryParams): Promise<AxiosResponse> => {
    return API_V2().get(`/recommendations/${params.id}`);
  },
}

export default DashboardAnimeService;
