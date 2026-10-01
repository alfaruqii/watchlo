/**
 * High-performance In-Memory TTL & Stale-While-Revalidate Server Cache.
 * Dramatically accelerates Server-Side Rendering (SSR) filtering across
 * Movies, Series, Anime, and Manga by eliminating redundant HTTP roundtrips.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_ENTRIES = 500;

export function getServerCache<T>(key: string, ttlMs = DEFAULT_TTL_MS): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    return null;
  }
  return entry.data as T;
}

export function getStaleServerCache<T>(key: string): T | null {
  const entry = cache.get(key);
  return entry ? (entry.data as T) : null;
}

export function setServerCache<T>(key: string, data: T): void {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearServerCache(): void {
  cache.clear();
}
