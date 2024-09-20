import axios, { AxiosInstance } from "axios";
import { getEnv } from "../utils/getEnv";

export const API_V1 = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const BASE_URL = getEnv('PUBLIC_WATCHLO_API_V1');

  const instance = axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
      'Content-type': 'application/json',
      ...headers,
    },
    params,
  });

  return instance;
}

export const API_V2 = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const BASE_URL = getEnv('PUBLIC_WATCHLO_API_V2');

  const instance = axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
      'Content-type': 'application/json',
      ...headers,
    },
    params,
  });

  return instance;
}

