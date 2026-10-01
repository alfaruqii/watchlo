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

export const API_V0 = ({ headers = {}, params = {}, timeout = 6500 } = {}): AxiosInstance => {
  const BASE_URL =
    process.env.WATCHLO_API_V0 ||
    process.env.NEXT_PUBLIC_WATCHLO_API_V0 ||
    getEnv("WATCHLO_API_V0");

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-type": "application/json",
      ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      ...headers,
    },
    params,
    timeout,
  });

  return instance;
};

const ANIME_API_BASE =
  process.env.WATCHLO_ANIME_API ||
  process.env.NEXT_PUBLIC_WATCHLO_ANIME_API ||
  getEnv("WATCHLO_ANIME_API");

export const API_V1 = ({ headers = {}, params = {}, timeout = 6500 } = {}): AxiosInstance => {
  const BASE_URL =
    process.env.WATCHLO_API_V1 ||
    process.env.NEXT_PUBLIC_WATCHLO_API_V1 ||
    getEnv("WATCHLO_API_V1") ||
    (ANIME_API_BASE ? `${ANIME_API_BASE}/v1` : undefined);

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-type": "application/json",
      ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      ...headers,
    },
    params,
    timeout,
  });

  return instance;
};

export const API_V2 = ({ headers = {}, params = {}, timeout = 6500 } = {}): AxiosInstance => {
  const BASE_URL =
    process.env.WATCHLO_API_V2 ||
    process.env.NEXT_PUBLIC_WATCHLO_API_V2 ||
    getEnv("WATCHLO_API_V2") ||
    (ANIME_API_BASE ? `${ANIME_API_BASE}/v2` : undefined);

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-type": "application/json",
      ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      ...headers,
    },
    params,
    timeout,
  });

  return instance;
};
