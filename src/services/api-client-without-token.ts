import { apiClient, ApiRequestConfig } from "./api-client";

const skipAuth: ApiRequestConfig = { skipAuth: true };

const apiClientWithoutToken = {
  post: (url: string, body?: unknown) => apiClient.post(url, body, skipAuth),
  get: (url: string) => apiClient.get(url, skipAuth),
};

export default apiClientWithoutToken;
