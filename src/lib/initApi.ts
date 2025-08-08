import axios from 'axios';
import { toast } from "sonner";

let api;

export const initApi = async () => {
  let config;

if (window?.electron?.getConfig) {
  config = await window.electron.getConfig();
  console.log('CONFIG FROM ELECTRON:', config);
} else {
  console.warn("Running without Electron. Falling back to default config.");
  config = { apiBaseUrl: 'http://localhost:8080/api' };
}


  api = axios.create({
    baseURL: config?.apiBaseUrl || 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptors
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');

        toast("Oops! Your session timed out. Let’s log you back in to keep learning!", {
          duration: 4000
        });

        setTimeout(() => {
          window.location.href = '/?auth=expired';
        }, 2000);

        return new Promise(() => {});
      }

      return Promise.reject(error.response?.data || error);
    }
  );

  return api;
};

export const getApi = () => {
  if (!api) throw new Error('API not initialized yet. Call initApi() first.');
  return api;
};
