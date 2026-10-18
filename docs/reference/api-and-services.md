# Reference: API Routes, Services, and Configuration

This document provides a technical reference for internal proxy routes, service classes, environment variables, and TypeScript types used in Watchlo.

---

## Internal Route Handlers (`app/api/*`)

All client components communicate with upstream services through Next.js Route Handlers. This pattern isolates private API keys and resolves upstream CORS limitations.

### `GET /api/animestream`

Fetches HLS video stream sources and subtitle tracks for a specific anime episode.

- **Query Parameters**:
  - `query` (string, required): The provider episode identifier (for example, `one-piece-episode-1`).
- **Response Shape**:
  ```typescript
  interface AnimeStreamResponse {
    headers: {
      Referer: string;
      [key: string]: string;
    };
    sources: Array<{
      url: string;
      isM3U8: boolean;
      quality: string;
    }>;
    subtitles?: Array<{
      url: string;
      lang: string;
    }>;
  }
  ```

### `GET /api/anime-skiptime`

Fetches sub-second timestamp intervals for opening themes, ending credits, recaps, and video chapters.

- **Query Parameters**:
  - `id` (string | number, required): AniList or MyAnimeList series identifier.
  - `ep` (string | number, required): Target episode number.
- **Response Shape**:
  ```typescript
  interface AniSkipResponse {
    code: number;
    message: string;
    found: boolean;
    results?: {
      op?: { interval: { startTime: number; endTime: number }; skipType: string };
      ed?: { interval: { startTime: number; endTime: number }; skipType: string };
      recap?: { interval: { startTime: number; endTime: number }; skipType: string };
      mixedOp?: { interval: { startTime: number; endTime: number }; skipType: string };
      mixedEd?: { interval: { startTime: number; endTime: number }; skipType: string };
      chapters?: Array<{
        title: string;
        type: string;
        startTime: number;
        endTime: number;
      }>;
    };
  }
  ```
- **Error Handling**: When upstream returns 404 (no timestamp data for episode), this route returns `{ found: false, results: null }` with HTTP 200 to prevent repeated client-side error states.

### `GET /api/anime-infov1`

Retrieves scraping-based episode rosters and server slugs from the streaming provider.

- **Query Parameters**:
  - `query` (string, required): Upstream anime slug or URL.
  - `title` (string, optional): Title hint used for fuzzy matching.

### `GET /api/anime-infov2`

Fetches comprehensive anime metadata, descriptions, trailer URLs, studio credits, genres, and relation graphs from AniList.

- **Query Parameters**:
  - `query` (string | number, required): AniList series identifier.

### `GET /api/anime-search`

Performs keyword search against the AniList anime catalog.

- **Query Parameters**:
  - `query` (string, required): Search query term.

### `GET /api/manga-search`

Searches manga and manhwa titles and returns chapter metadata.

- **Query Parameters**:
  - `q` (string, required): Manga search keyword.
  - `page` (number, optional, default: 1): Pagination page index.
  - `size` (number, optional, default: 20): Items per page.

### `GET /api/movie-search`

Searches movies and television series through TMDB.

- **Query Parameters**:
  - `query` (string, required): Title search string.

### `GET /api/subtitles`

Retrieves available subtitle languages and download URLs for cinema embeds.

- **Query Parameters**:
  - `id` (string, required): Media identifier.

---

## Service Layer (`app/services/index.ts`)

The service layer wraps Axios instances configured in `app/lib/api.ts`.

### `MovieService`
Communicates with `API_V0` (`WATCHLO_API_V0`) for TMDB data.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `getMoviesTrending()` | `/tmdb/movies/trending` | Returns weekly trending movies |
| `getMoviesTopRated()` | `/tmdb/movies/top-rated` | Returns highest-rated movies |
| `getMoviesById(id)` | `/tmdb/movies/${id}` | Returns movie details and backdrop |
| `getMovieTrailer(id)` | `/tmdb/movies/${id}/videos` | Returns YouTube trailer keys |
| `getTvTrending()` | `/tmdb/tv/trending` | Returns trending television series |
| `getTvById(id)` | `/tmdb/tv/${id}` | Returns television series details |
| `getTvSeason(id, season)` | `/tmdb/tv/${id}/season/${season}` | Returns season episodes list |
| `searchMovie(title)` | `/tmdb/search` | Searches movies and series |

### `AnimeServiceV1`
Communicates with `API_V1` (`WATCHLO_API_V1`) for stream URLs.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `getRecentEpisodeGogo()` | `/recentepisode/all` | Returns recently updated anime episodes |
| `getAnimeStreamGogo(id)` | `/stream/${id}` | Fetches HLS playback source URLs |
| `getAnimeInfoV1Gogo(id, titleHint)` | `/info/${id}` | Returns episode lists with provider IDs |

### `AnimeServiceV2`
Communicates with `API_V2` (`WATCHLO_API_V2`) for AniList metadata and AniSkip.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `getTrendingAnime()` | `/trending` | Returns trending anime cards |
| `getPopularAnime()` | `/popular` | Returns popular anime of all time |
| `getAnimeInfoV2(id)` | `/info/${id}` | Returns detailed AniList series record |
| `getRecommendationAnime(id)` | `/recommendations/${id}` | Returns related anime recommendations |
| `searchAnimeV2(title)` | `/search` | Searches AniList catalog |
| `getSkipTime(id, ep)` | `/stream/skiptime/${id}/${ep}` | Returns opening, ending, and recap intervals |

### `MangaService`
Communicates with `API_V2` for manga discovery and reading.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `getTrendingManga(subtype, page, size)` | `/manga/trending` | Returns trending manga titles |
| `getPopularManga(subtype, page, size)` | `/manga/popular` | Returns popular manga titles |
| `searchManga(q, subtype, page, size)` | `/manga/search` | Searches manga catalog |
| `getMangaInfo(id)` | `/manga/info/${id}` | Returns manga metadata and synopsis |
| `getMangaChapters(id, lang, provider)` | `/manga/chapters/${id}` | Returns chapter lists |
| `readMangaChapter(chapterId, quality)` | `/manga/read` | Returns image URLs for a chapter |

---

## Environment Variables

All upstream service URLs and access tokens are strictly server-only. They are never exposed to browser bundles.

| Variable Name | Context | Default / Fallback | Description |
| :--- | :--- | :--- | :--- |
| `WATCHLO_API_V0` | Server-only | `undefined` | TMDB movie and series proxy base URL |
| `WATCHLO_API_V1` | Server-only | `${WATCHLO_ANIME_API}/v1` | Anime streaming provider base URL |
| `WATCHLO_API_V2` | Server-only | `${WATCHLO_ANIME_API}/v2` | AniList and AniSkip provider base URL |
| `WATCHLO_ANIME_API` | Server-only | `undefined` | Shared base URL for anime API versions |
| `CUSTOM_API_KEY` | Server-only | `undefined` | Upstream authentication key sent in `x-api-key` header |
| `INTERNAL_API_SECRET` | Server-only | `undefined` | Secret key used to sign anti-leech session tokens |
| `GOGO_PATH` | Server-only | `undefined` | Scraper mirror prefix URL |

None of the keys above should use the `NEXT_PUBLIC_` prefix. Next.js Route Handlers consume them exclusively on the server.
