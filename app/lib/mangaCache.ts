/**
 * Backward-compatible re-exports from universal serverCache.
 */
export {
  getServerCache as getMangaCache,
  getStaleServerCache as getStaleMangaCache,
  setServerCache as setMangaCache,
  clearServerCache as clearMangaCache,
} from "./serverCache";
