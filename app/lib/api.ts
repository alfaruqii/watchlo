import axios, { AxiosInstance } from "axios";
import { getEnv } from "@/utils/getEnv";

// Runtime assertion: Ensure this module is never bundled into client JavaScript.
if (typeof window !== "undefined") {
  throw new Error("Security Violation: Upstream API client can only be used on the server.");
}

// Server-only access key. Never exposed to browser bundles.
const API_KEY =
  process.env.CUSTOM_API_KEY ||
  getEnv("CUSTOM_API_KEY");

const instanceCache = new Map<string, AxiosInstance>();

function getOrCreateInstance(
  version: string,
  getBaseUrl: () => string | undefined,
  options: { headers?: Record<string, string>; params?: Record<string, unknown>; timeout?: number } = {}
): AxiosInstance {
  const { headers = {}, params = {}, timeout = 6500 } = options;
  const hasCustomHeaders = Object.keys(headers).length > 0;
  const hasCustomParams = Object.keys(params).length > 0;

  // Cache key for reusing instances with identical configuration
  const cacheKey = `${version}:${timeout}:${hasCustomHeaders ? JSON.stringify(headers) : ""}:${hasCustomParams ? JSON.stringify(params) : ""}`;

  let instance = instanceCache.get(cacheKey);
  if (!instance) {
    const BASE_URL = getBaseUrl();
    instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-type": "application/json",
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        ...headers,
      },
      params,
      timeout,
    });
    instanceCache.set(cacheKey, instance);
  }

  return instance;
}

export const API_V0 = (options?: { headers?: Record<string, string>; params?: Record<string, unknown>; timeout?: number }): AxiosInstance => {
  return getOrCreateInstance("v0", () => (
    process.env.WATCHLO_API_V0 ||
    process.env.NEXT_PUBLIC_WATCHLO_API_V0 ||
    getEnv("WATCHLO_API_V0")
  ), options);
};

const ANIME_API_BASE =
  process.env.WATCHLO_ANIME_API ||
  process.env.NEXT_PUBLIC_WATCHLO_ANIME_API ||
  getEnv("WATCHLO_ANIME_API");

export const API_V1 = (options?: { headers?: Record<string, string>; params?: Record<string, unknown>; timeout?: number }): AxiosInstance => {
  return getOrCreateInstance("v1", () => (
    process.env.WATCHLO_API_V1 ||
    process.env.NEXT_PUBLIC_WATCHLO_API_V1 ||
    getEnv("WATCHLO_API_V1") ||
    (ANIME_API_BASE ? `${ANIME_API_BASE}/v1` : undefined)
  ), options);
};

export const API_V2 = (options?: { headers?: Record<string, string>; params?: Record<string, unknown>; timeout?: number }): AxiosInstance => {
  return getOrCreateInstance("v2", () => (
    process.env.WATCHLO_API_V2 ||
    process.env.NEXT_PUBLIC_WATCHLO_API_V2 ||
    getEnv("WATCHLO_API_V2") ||
    (ANIME_API_BASE ? `${ANIME_API_BASE}/v2` : undefined)
  ), options);
};
