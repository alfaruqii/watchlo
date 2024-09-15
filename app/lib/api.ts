import axios, { AxiosInstance } from "axios";
import { getUrl } from "../utils/getUrl";

export const API_V1 = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const BASE_URL = getUrl('PUBLIC_WATCHLO_API_V1');

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
  const BASE_URL = getUrl('PUBLIC_WATCHLO_API_V2');

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

