import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ACCESS_TOKEN_KEY,
  API_BASE_URL,
  AUTH_HEADER,
  PUBLIC_ENDPOINTS,
} from "./api-config";

export const UNAUTHORIZED_EVENT = "cpm:unauthorized";

export interface ApiRequestConfig extends AxiosRequestConfig {
  /** Evita enviar el token de sesión en esta petición. */
  skipAuth?: boolean;
}

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

const normalizeUrl = (url?: string): string => {
  if (!url) {
    return "";
  }

  return url.split("?")[0];
};

export const isPublicEndpoint = (url?: string): boolean => {
  const path = normalizeUrl(url);
  return PUBLIC_ENDPOINTS.some((endpoint) => path.endsWith(endpoint));
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  const requestConfig = config as ApiRequestConfig;
  const headers: Record<string, string | number | boolean> = {
    ...(config.headers as Record<string, string | number | boolean>),
  };

  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const shouldSendToken =
    !requestConfig.skipAuth && !isPublicEndpoint(config.url);

  if (shouldSendToken) {
    const accessToken = getAccessToken();

    if (accessToken) {
      headers[AUTH_HEADER] = accessToken;
    }
  } else {
    delete headers[AUTH_HEADER];
  }

  config.headers = headers;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (
      status === 401 &&
      typeof window !== "undefined" &&
      !isPublicEndpoint(error?.config?.url)
    ) {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  }
);

type RequestBody = unknown;

const request = {
  get: (url: string, config?: ApiRequestConfig) =>
    apiClient.get(url, config),
  post: (url: string, body?: RequestBody, config?: ApiRequestConfig) =>
    apiClient.post(url, body, config),
  /**
   * Envía el token como query param (`?token=...`) sin usar el token de
   * sesión almacenado. Se usa para verificación de email y reseteo.
   */
  postWithToken: (url: string, body: RequestBody, token: string) => {
    const config: ApiRequestConfig = {
      params: { token },
      skipAuth: true,
    };

    return apiClient.post(url, body, config);
  },
  put: (url: string, body?: RequestBody, config?: ApiRequestConfig) =>
    apiClient.put(url, body, config),
  patch: (url: string, body?: RequestBody, config?: ApiRequestConfig) =>
    apiClient.patch(url, body, config),
  delete: (url: string, config?: ApiRequestConfig) =>
    apiClient.delete(url, config),
};

export default request;
