// src/lib/api.ts
import axios from "axios";
import { getApiBaseUrl } from "@/lib/config";

export const authApi = axios.create();

authApi.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
