import { AnimeSchQueryParams } from "@/types/global";
import { AdvancedSearchPayload, AnimeCreditsResponse } from "@/types/anime.type";
import { TMDBCreditsResponse, TMDBGenre } from "@/types/movies.type";
import { API_V0, API_V1, API_V2 } from "../lib/api";
import { AxiosResponse } from "axios";
import { MangaItem } from "@/types/manga.type";
import {
  getServerCache,
  getStaleServerCache,
  setServerCache,
} from "../lib/serverCache";
import {
  getMangaCache,
  getStaleMangaCache,
  setMangaCache,
} from "../lib/mangaCache";
import { JAPANESE_MANGA_FALLBACK } from "../data/mangaArchiveFallback";

const MovieService = {
  getMoviesPopular: async (): Promise<AxiosResponse> => {
    const cacheKey = "movie:popular";
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V0({ timeout: 6000 }).get("/tmdb/movies/popular");
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getMoviesTrending: async (): Promise<AxiosResponse> => {
    const cacheKey = "movie:trending";
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V0({ timeout: 6000 }).get(`/tmdb/movies/trending`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getMoviesTopRated: async (): Promise<AxiosResponse> => {
    const cacheKey = "movie:top-rated";
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V0({ timeout: 6000 }).get(`/tmdb/movies/top-rated`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getMoviesById: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `movie:info:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/movies/${id}`);
    setServerCache(cacheKey, res);
    return res;
  },
  getMovieTrailer: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `movie:trailer:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/movies/${id}/videos`);
    setServerCache(cacheKey, res);
    return res;
  },
  getMovieRecommendations: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `movie:recs:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/movies/${id}/recommendations`);
    setServerCache(cacheKey, res);
    return res;
  },
  getMovieSimilar: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `movie:similar:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/movies/${id}/similar`);
    setServerCache(cacheKey, res);
    return res;
  },
  getMovieReviews: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `movie:reviews:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/movies/${id}/reviews`);
    setServerCache(cacheKey, res);
    return res;
  },
  getMovieCredits: async (
    id: string
  ): Promise<AxiosResponse<TMDBCreditsResponse>> => {
    const cacheKey = `movie:credits:${id}`;
    const cached = getServerCache<AxiosResponse<TMDBCreditsResponse>>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/movies/${id}/credits`);
    setServerCache(cacheKey, res);
    return res;
  },
  getTvTrending: async (): Promise<AxiosResponse> => {
    const cacheKey = "tv:trending";
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/trending`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getTvTopRated: async (): Promise<AxiosResponse> => {
    const cacheKey = "tv:top-rated";
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/top-rated`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getTvById: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `tv:info:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/${id}`);
    setServerCache(cacheKey, res);
    return res;
  },
  getTvSeason: async (id: string, season: string): Promise<AxiosResponse> => {
    const cacheKey = `tv:season:${id}:${season}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/${id}/season/${season}`);
    setServerCache(cacheKey, res);
    return res;
  },
  getTvEpisode: async (
    id: string,
    season: string,
    episode: string
  ): Promise<AxiosResponse> => {
    const cacheKey = `tv:ep:${id}:${season}:${episode}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/${id}/season/${season}/episode/${episode}`);
    setServerCache(cacheKey, res);
    return res;
  },
  getTvTrailer: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `tv:trailer:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/${id}/videos`);
    setServerCache(cacheKey, res);
    return res;
  },
  getTvRecommendations: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `tv:recs:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/${id}/recommendations`);
    setServerCache(cacheKey, res);
    return res;
  },
  getTvSimilar: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `tv:similar:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/${id}/similar`);
    setServerCache(cacheKey, res);
    return res;
  },
  getTvReviews: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `tv:reviews:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/${id}/reviews`);
    setServerCache(cacheKey, res);
    return res;
  },
  getTvCredits: async (
    id: string
  ): Promise<AxiosResponse<TMDBCreditsResponse>> => {
    const cacheKey = `tv:credits:${id}`;
    const cached = getServerCache<AxiosResponse<TMDBCreditsResponse>>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/tv/${id}/credits`);
    setServerCache(cacheKey, res);
    return res;
  },
  getGenres: async (): Promise<AxiosResponse<{ genres: TMDBGenre[] }>> => {
    const cacheKey = "movie:genres";
    const cached = getServerCache<AxiosResponse<{ genres: TMDBGenre[] }>>(cacheKey);
    if (cached) return cached;
    const res = await API_V0({ timeout: 6000 }).get(`/tmdb/genres`);
    setServerCache(cacheKey, res);
    return res;
  },
  searchMovie: async (title?: string): Promise<AxiosResponse> => {
    const cleanTitle = title?.toLowerCase().trim() || "";
    const cacheKey = `movie:search:${cleanTitle}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V0({ params: { query: title }, timeout: 6000 }).get(`/tmdb/search`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
};

const AnimeServiceV1 = {
  getRecentEpisodeGogo: async (): Promise<AxiosResponse> => {
    const cacheKey = "anime:v1:recent";
    const cached = getServerCache<AxiosResponse>(cacheKey, 5 * 60 * 1000);
    if (cached) return cached;
    try {
      const res = await API_V1({ timeout: 6000 }).get("/recentepisode/all");
      if (res.data?.results && Array.isArray(res.data.results)) {
        res.data.results = res.data.results.map((item: Record<string, unknown>) => ({
          ...item,
          episodeId: item.episode_id || item.episodeId,
          episodeNumber: Number(item.episode || item.episodeNumber || 1),
          image: item.image_url || item.image,
        }));
      }
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getAnimeStreamGogo: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `anime:v1:stream:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V1({ timeout: 8000 }).get(`/stream/${encodeURIComponent(id)}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getAnimeInfoV1Gogo: async (
    id: string,
    titleHint?: string
  ): Promise<AxiosResponse> => {
    const cacheKey = `anime:v1:info:${id}:${titleHint || ""}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;

    const normalizeResponse = (res: AxiosResponse, resolvedId: string) => {
      if (res.data) {
        res.data.id = res.data.id || resolvedId;
        if (res.data.image_url && !res.data.image) {
          res.data.image = res.data.image_url;
        }
        res.data.subOrDub =
          res.data.subOrDub || (resolvedId.includes("-dub") ? "dub" : "sub");
        if (Array.isArray(res.data.episodes)) {
          res.data.episodes = res.data.episodes.map(
            (ep: Record<string, unknown>) => ({
              ...ep,
              number: Number(ep.number ?? ep.episode ?? 1),
              url:
                ep.url ||
                `/anime/watch?id=${encodeURIComponent(resolvedId)}&ep=${ep.number ?? ep.episode ?? 1}`,
            })
          );
        }
      }
      return res;
    };

    try {
      const isUrl = /^https?:\/\//i.test(id) || id.includes("/");

      // 1. Try direct lookup first when id is already a clean slug
      if (!isUrl) {
        try {
          const directRes = await API_V1({ timeout: 6000 }).get(`/info/${encodeURIComponent(id)}`);
          if (directRes.data && Array.isArray(directRes.data.episodes)) {
            const normalized = normalizeResponse(directRes, id);
            setServerCache(cacheKey, normalized);
            return normalized;
          }
        } catch {
          // Fall through to smart search resolution below
        }
      }

      // 2. Extract slug from URL or raw provider ID and search API_V1 (/search)
      const rawSlug = (id.split("/").filter(Boolean).pop() || id).trim();
      const baseSlug = rawSlug.replace(/-dub$/i, "");
      const slugWithoutTv = baseSlug.replace(/-tv$/i, "");
      const searchQuery =
        slugWithoutTv.replace(/-/g, " ").trim() ||
        (titleHint ? titleHint.split("|||")[0].trim() : "");

      const norm = (str?: string) =>
        (str || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, " ")
          .trim();
      const escapeRegex = (str: string) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const titleCandidates = [
        searchQuery,
        ...(titleHint ? titleHint.split("|||").map((t) => t.trim()) : []),
      ]
        .filter(Boolean)
        .map(norm);

      const searchRes = await API_V1({
        params: { q: searchQuery, page: 1 },
        timeout: 6000,
      }).get("/search");

      const results: Array<{ id: string; title?: string }> = Array.isArray(
        searchRes.data?.results
      )
        ? searchRes.data.results
        : [];

      const exactSlugRegex = new RegExp(
        `^${escapeRegex(baseSlug)}-[a-z0-9]{4,6}$`,
        "i"
      );
      const noTvSlugRegex = new RegExp(
        `^${escapeRegex(slugWithoutTv)}-[a-z0-9]{4,6}$`,
        "i"
      );

      const matched =
        results.find((r) => exactSlugRegex.test(r.id)) ||
        results.find((r) => noTvSlugRegex.test(r.id)) ||
        results.find((r) => titleCandidates.includes(norm(r.title))) ||
        results.find(
          (r) =>
            r.id.toLowerCase() === baseSlug.toLowerCase() ||
            r.id.toLowerCase().startsWith(`${baseSlug.toLowerCase()}-`)
        );

      const resolvedId = matched?.id || baseSlug;
      const res = await API_V1({ timeout: 6000 }).get(`/info/${encodeURIComponent(resolvedId)}`);

      const returnedTitle = norm(res.data?.title || "");
      const hasTitleMismatch =
        titleCandidates.length > 0 &&
        Boolean(returnedTitle) &&
        !titleCandidates.some((c) => {
          if (!c) return false;
          if (returnedTitle.includes(c) || c.includes(returnedTitle)) return true;
          const candWords = c.split(" ").filter((w: string) => w.length >= 3);
          const retWords = returnedTitle.split(" ").filter((w: string) => w.length >= 3);
          return candWords.some((w: string) => retWords.includes(w));
        });

      if (hasTitleMismatch) {
        throw new Error(
          `Title mismatch: expected one of [${titleCandidates.join(", ")}], but got "${res.data?.title}"`
        );
      }

      const normalized = normalizeResponse(res, resolvedId);
      setServerCache(cacheKey, normalized);
      return normalized;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getGenres: async (): Promise<AxiosResponse<string[]>> => {
    const cacheKey = "anime:v1:genres";
    const cached = getServerCache<AxiosResponse<string[]>>(cacheKey, 60 * 60 * 1000);
    if (cached) return cached;
    try {
      const res = await API_V1({ timeout: 6000 }).get("/genres");
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse<string[]>>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getAnimeByGenre: async (
    genre: string,
    page = 1
  ): Promise<AxiosResponse> => {
    const cacheKey = `anime:v1:genre:${genre.toLowerCase()}:${page}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V1({ params: { page }, timeout: 6000 }).get(`/genres/${encodeURIComponent(genre)}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
};

const AnimeServiceV2 = {
  getScheduledAnime: async (
    params?: AnimeSchQueryParams
  ): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:schedule:${JSON.stringify(params || {})}`;
    const cached = getServerCache<AxiosResponse>(cacheKey, 15 * 60 * 1000);
    if (cached) return cached;
    try {
      const res = await API_V2({ params, timeout: 6000 }).get(`/schedule`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getTrendingAnime: async (): Promise<AxiosResponse> => {
    const cacheKey = "anime:v2:trending";
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).get(`/trending`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getPopularAnime: async (): Promise<AxiosResponse> => {
    const cacheKey = "anime:v2:popular";
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).get(`/popular`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getAnimeInfoV2: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:info:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).get(`/info/${id}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getRecommendationAnime: async (id: string): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:recs:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).get(`/recommendations/${id}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  searchAnimeV2: async (title?: string): Promise<AxiosResponse> => {
    const cleanTitle = title?.toLowerCase().trim() || "";
    const cacheKey = `anime:v2:search:${cleanTitle}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ params: { q: title }, timeout: 6000 }).get(`/search`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getSkipTime: async (
    id: string | number,
    ep: string | number
  ): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:skiptime:${id}:${ep}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).get(`/stream/skiptime/${id}/${ep}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getCredits: async (
    id: string | number,
    type: "ANIME" | "MANGA" = "ANIME"
  ): Promise<AxiosResponse<AnimeCreditsResponse>> => {
    const cacheKey = `anime:v2:credits:${id}:${type}`;
    const cached = getServerCache<AxiosResponse<AnimeCreditsResponse>>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ params: { type }, timeout: 6000 }).get(`/credits/${id}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AnimeCreditsResponse>(cacheKey);
      if (stale) return stale as unknown as AxiosResponse<AnimeCreditsResponse>;
      throw err;
    }
  },
  getStaffDetail: async (id: string | number): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:staff:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).get(`/staff/${id}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getCharacterDetail: async (id: string | number): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:character:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).get(`/character/${id}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  advancedSearchAnime: async (
    payload: AdvancedSearchPayload
  ): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:advsearch:${JSON.stringify(payload)}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).post(`/search`, payload);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getRandomAnime: async (generated = 1): Promise<AxiosResponse> => {
    return API_V2({ params: { generated }, timeout: 6000 }).get(`/random`);
  },
  getSeasonalAnime: async (
    season: "WINTER" | "SPRING" | "SUMMER" | "FALL",
    year: number,
    page = 1,
    limit = 20
  ): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:seasonal:${season}:${year}:${page}:${limit}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ params: { p: page, limit }, timeout: 6000 }).get(
        `/season/${season}/${year}`
      );
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getAnimeEpisodesV2: async (
    id: string | number
  ): Promise<AxiosResponse> => {
    const cacheKey = `anime:v2:episodes:${id}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 6000 }).get(`/episode/${id}`);
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
  getAnimeStreamV2: async (
    params:
      | string
      | {
          id?: string | number;
          ep?: string | number;
          episode?: string | number;
          watchId?: string;
          provider?: string;
          dub?: boolean;
        }
  ): Promise<AxiosResponse> => {
    const queryParams =
      typeof params === "string" ? { watchId: params } : params;
    const cacheKey = `anime:v2:stream:${JSON.stringify(queryParams)}`;
    const cached = getServerCache<AxiosResponse>(cacheKey);
    if (cached) return cached;
    try {
      const res = await API_V2({ timeout: 10000 }).get(`/stream/multi`, {
        params: queryParams,
      });
      setServerCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleServerCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },
};

const MangaService = {
  getTrendingManga: async (
    subtype = "all",
    page = 1,
    size = 20
  ): Promise<AxiosResponse> => {
    const cacheKey = `manga:trending:${subtype}:${page}:${size}`;
    const cached = getMangaCache<AxiosResponse>(cacheKey);
    if (cached) return cached;

    const createFallbackResponse = (items: MangaItem[]): AxiosResponse =>
      ({
        data: { results: items },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as AxiosResponse["config"],
      } as AxiosResponse);

    try {
      const effectiveSubtype = subtype === "manga" ? "all" : subtype;
      const res = await API_V2({ timeout: 5000 }).get(`/manga/trending`, {
        params: { subtype: effectiveSubtype, p: page, limit: Math.max(size, 25), page, size: Math.max(size, 25) },
      });
      const rawResults = res.data?.results || res.data?.data?.results || [];

      if (subtype === "manga" && rawResults.length > 0) {
        const filtered = rawResults.filter((r: MangaItem) => r.countryOfOrigin === "JP" || !r.countryOfOrigin);
        if (filtered.length > 0) {
          if (res.data?.results) res.data.results = filtered.slice(0, size);
          if (res.data?.data?.results) res.data.data.results = filtered.slice(0, size);
        }
      }

      const results = res.data?.results || res.data?.data?.results || [];

      // If trending returned empty, fallback to popular Japanese manga or curated fallback
      if (results.length === 0 && subtype === "manga") {
        try {
          const fallbackPop = await MangaService.getPopularManga(subtype, page, size);
          const popResults = fallbackPop.data?.results || fallbackPop.data?.data?.results || [];
          if (popResults.length > 0) {
            setMangaCache(cacheKey, fallbackPop);
            return fallbackPop;
          }
        } catch {
          // Continue to curated fallback
        }
        const fallbackRes = createFallbackResponse(JAPANESE_MANGA_FALLBACK);
        setMangaCache(cacheKey, fallbackRes);
        return fallbackRes;
      }

      if (results.length > 0) {
        setMangaCache(cacheKey, res);
      }
      return res;
    } catch (err) {
      const stale = getStaleMangaCache<AxiosResponse>(cacheKey);
      if (stale) return stale;

      if (subtype === "manga") {
        const fallbackRes = createFallbackResponse(JAPANESE_MANGA_FALLBACK);
        setMangaCache(cacheKey, fallbackRes);
        return fallbackRes;
      }
      throw err;
    }
  },

  getPopularManga: async (
    subtype = "all",
    page = 1,
    size = 20
  ): Promise<AxiosResponse> => {
    const cacheKey = `manga:popular:${subtype}:${page}:${size}`;
    const cached = getMangaCache<AxiosResponse>(cacheKey);
    if (cached) return cached;

    const createFallbackResponse = (items: MangaItem[]): AxiosResponse =>
      ({
        data: { results: items },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as AxiosResponse["config"],
      } as AxiosResponse);

    try {
      const effectiveSubtype = subtype === "manga" ? "all" : subtype;
      const res = await API_V2({ timeout: 5000 }).get(`/manga/popular`, {
        params: { subtype: effectiveSubtype, p: page, limit: Math.max(size, 25), page, size: Math.max(size, 25) },
      });
      const rawResults = res.data?.results || res.data?.data?.results || [];

      if (subtype === "manga" && rawResults.length > 0) {
        const filtered = rawResults.filter((r: MangaItem) => r.countryOfOrigin === "JP" || !r.countryOfOrigin);
        if (filtered.length > 0) {
          if (res.data?.results) res.data.results = filtered.slice(0, size);
          if (res.data?.data?.results) res.data.data.results = filtered.slice(0, size);
        }
      }

      const results = res.data?.results || res.data?.data?.results || [];
      if (results.length === 0 && subtype === "manga") {
        const fallbackRes = createFallbackResponse(JAPANESE_MANGA_FALLBACK);
        setMangaCache(cacheKey, fallbackRes);
        return fallbackRes;
      }

      if (results.length > 0) {
        setMangaCache(cacheKey, res);
      }
      return res;
    } catch (err) {
      const stale = getStaleMangaCache<AxiosResponse>(cacheKey);
      if (stale) return stale;

      if (subtype === "manga") {
        const fallbackRes = createFallbackResponse(JAPANESE_MANGA_FALLBACK);
        setMangaCache(cacheKey, fallbackRes);
        return fallbackRes;
      }
      throw err;
    }
  },

  searchManga: async (
    q: string,
    subtype = "all",
    page = 1,
    size = 20
  ): Promise<AxiosResponse> => {
    const cleanQ = q.trim();
    const cacheKey = `manga:search:${cleanQ.toLowerCase()}:${subtype}:${page}:${size}`;
    const cached = getMangaCache<AxiosResponse>(cacheKey);
    if (cached) return cached;

    try {
      const res = await API_V2({ timeout: 5000 }).get(`/manga/search`, {
        params: { q: cleanQ, subtype, p: page, limit: size, page, size },
      });
      setMangaCache(cacheKey, res);
      return res;
    } catch (err) {
      const stale = getStaleMangaCache<AxiosResponse>(cacheKey);
      if (stale) return stale;
      throw err;
    }
  },

  getMangaInfo: async (id: string | number): Promise<AxiosResponse> => {
    const cacheKey = `manga:info:${id}`;
    const cached = getMangaCache<AxiosResponse>(cacheKey);
    if (cached) return cached;

    const res = await API_V2({ timeout: 6000 }).get(`/manga/info/${id}`);
    setMangaCache(cacheKey, res);
    return res;
  },

  getMangaRecommendations: async (
    id: string | number
  ): Promise<AxiosResponse> => {
    const cacheKey = `manga:recs:${id}`;
    const cached = getMangaCache<AxiosResponse>(cacheKey);
    if (cached) return cached;

    const res = await API_V2({ timeout: 5000 }).get(`/manga/recommendations/${id}`);
    setMangaCache(cacheKey, res);
    return res;
  },

  getMangaChapters: async (
    id: string | number,
    lang = "all",
    provider = "auto"
  ): Promise<AxiosResponse> => {
    const cacheKey = `manga:chapters:${id}:${lang}:${provider}`;
    const cached = getMangaCache<AxiosResponse>(cacheKey);
    if (cached) return cached;

    const res = await API_V2({ timeout: 8000 }).get(`/manga/chapters/${id}`, {
      params: { lang, provider },
    });
    setMangaCache(cacheKey, res);
    return res;
  },

  readMangaChapter: async (
    chapterId: string,
    quality = "high"
  ): Promise<AxiosResponse> => {
    return API_V2({ timeout: 8000 }).get(`/manga/read`, {
      params: { chapterId, quality },
    });
  },

  getMangaCredits: async (
    id: string | number
  ): Promise<AxiosResponse<AnimeCreditsResponse>> => {
    const cacheKey = `manga:credits:${id}`;
    const cached = getMangaCache<AxiosResponse<AnimeCreditsResponse>>(cacheKey);
    if (cached) return cached;

    const res = await API_V2({ timeout: 6000 }).get(`/manga/credits/${id}`);
    setMangaCache(cacheKey, res);
    return res;
  },
};

export { MovieService, AnimeServiceV1, AnimeServiceV2, MangaService };

